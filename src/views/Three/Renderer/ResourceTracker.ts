import * as THREE from 'three';
import { EventDispatcher } from 'three';

function isShaderMaterial(material: THREE.Material): material is THREE.ShaderMaterial | THREE.RawShaderMaterial {
  return 'uniforms' in material;
}

interface Object {
  object: any;
  resources: Set<any>;
}

export default class ResourceTracker<TEventMap extends {} = {}> extends EventDispatcher<TEventMap> {
  objects: {
    [key: string]: Object;
  };
  constructor() {
    super();
    this.objects = {};
  }

  track(object: any) {
    this.objects[object.uuid] = {
      object: object,
      resources: new Set(),
    };
    this.traverse(object.uuid, object);
    return object;
  }

  traverse(id: string, resource: any) {
    if (!resource) {
      return resource;
    }

    if (Array.isArray(resource)) {
      resource.forEach((resource) => this.traverse(id, resource));
    }

    if (resource.dispose || resource instanceof THREE.Object3D) {
      this.objects[id].resources.add(resource);
    }

    if (resource instanceof THREE.Mesh) {
      this.traverse(id, resource.geometry);
      this.traverse(id, resource.material);
      this.traverse(id, resource.children);
    } else if (resource instanceof THREE.Material) {
      // We have to check if there are any textures on the material
      for (const value of Object.values(resource)) {
        if (value instanceof THREE.Texture) {
          this.traverse(id, value);
        }
      }

      // We also have to check if any uniforms reference textures or arrays of textures
      if (isShaderMaterial(resource)) {
        if (resource.uniforms) {
          for (const value of Object.values(resource.uniforms)) {
            if (value) {
              const uniformValue = value.value;
              if (uniformValue instanceof THREE.Texture || Array.isArray(uniformValue)) {
                this.traverse(id, uniformValue);
              }
            }
          }
        }
      }
    }
  }

  removeObjectById(id: string) {
    let object: Object | null = this.objects[id];
    delete this.objects[id];
    for (const resource of object.resources) {
      if (resource instanceof THREE.Object3D) {
        if (resource.parent) {
          resource.parent.remove(resource);
        }
      }

      if (resource.dispose) {
        resource.dispose();
      }
    }

    object.resources.clear();
    object = null;
  }
}
