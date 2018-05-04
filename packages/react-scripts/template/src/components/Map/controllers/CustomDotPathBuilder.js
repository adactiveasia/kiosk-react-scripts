import { Group, Vector3 } from 'three';
import { PathSectionObject  } from '@adactive/adsum-web-map';
import PathSection from './PathSection';

class CustomDotPathBuilder {
  constructor() {
      /**
       * @package
       * @type {AdsumProjector}
       */
      this.projector = null;

      /**
       * @package
       * @type {ObjectManager}
       */
      this.objectManager = null;

      /**
       * @package
       * @default null
       * @type {AdsumWebMap.WayfindingOptions}
       */
      this.options = null;

      this.awm = null;

      this.mergePathSectionObject = [];
      this.mergePathSections = null;
  }

  /**
   * @package
   *
   * @param {AdsumWebMap} awm
   */
  init(awm) {
      this.awm = awm;
      this.projector = this.awm.wayfindingManager.dotPathBuilder.projector;
      this.objectManager = this.awm.wayfindingManager.dotPathBuilder.objectManager;
      this.options = this.awm.wayfindingManager.dotPathBuilder.options;
  }
  /**
   * @package
   *
   * @param {pathSection[]} pathSections
   */
  buildMerged(pathSections) {

    this.pathSections = pathSections;
    let allNodes = [];
    this.pathSections.forEach((pathSection)=> {
      allNodes = [...allNodes, ...pathSection.nodes];
    });
    const firstPathSection = this.pathSections[0];
    const lastPathSection = this.pathSections[this.pathSections.length-1];
    const mergePathSections = new PathSection(firstPathSection.from,firstPathSection.ground, lastPathSection.to, allNodes);
    this.mergePathSections = mergePathSections;

    const pathSectionMesh = new Group();

    const points = mergePathSections.interpolate(this.options.patternSpace, this.projector);
    for (let i = 0; i < points.length - 1; i++) {
      const point = points[i].position;
      const nextPoint = points[i + 1].position;
      const ground = points[i].ground;

      const pattern = this.awm.wayfindingManager.dotPathBuilder._createPattern();
      pattern.position.copy(point);

      const direction = nextPoint.clone().sub(pattern.position);

      let rotationAngle = 0.0;
      if (direction.y === 0.0) {
        rotationAngle = (direction.x > 0.0) ? (Math.PI / 2.0) : (-Math.PI / 2.0);
      } else {
        rotationAngle = Math.atan(direction.x / direction.y);
      }

      if (direction.y < 0.0) {
        rotationAngle += Math.PI;
      }

      pattern.setRotationFromAxisAngle(new Vector3(-0, -0, -1), rotationAngle);

      pattern.ground = ground; // TODO

      pathSectionMesh.add(pattern);
      pathSectionMesh.visible = false;
    }

    const pathSectionObject = PathSectionObject._createFromPathSection(
      mergePathSections,
      pathSectionMesh,
      this.options.patternSpace,
    );
    mergePathSections.ground._addChild(pathSectionObject);
    pathSectionObject.update();

    this.objectManager.pathSectionObjects.set(pathSectionObject.id, pathSectionObject);

    this.mergePathSectionObject = pathSectionObject;
  }

    build(pathSection) {
        const pathSectionMesh = new Group();

        const patterns = this.mergePathSectionObject._mesh.children;
        for (let i = 0; i < patterns.length; i++) {
            const pattern = patterns[i];
            pattern.up.set(0,0,1);
            if(i < patterns.length - 1) {
                const nextPattern = patterns[i+1];
                pattern.lookAt(new Vector3(nextPattern.position.x, nextPattern.position.y, nextPattern.position.z));
            } else {
                if(this.mergePathSectionObject.pathSection.to) {
                    const nextPosition = this.projector.utmToAdsum(this.mergePathSectionObject.pathSection.to.pathNode.utmPosition);
                    pattern.lookAt(new Vector3(nextPosition.x, nextPosition.y, nextPosition.z));
                }
            }
        }

        this.mergePathSectionObject._mesh.children.forEach((mesh,i)=>{
            if(mesh.ground.id === pathSection.ground.id) {
                pathSectionMesh.add(mesh.clone());
            }
        });

        const pathSectionObject = PathSectionObject._createFromPathSection(
            pathSection,
            pathSectionMesh,
            this.options.patternSpace,
        );
        pathSection.ground._addChild(pathSectionObject);
        pathSectionObject.update();

        this.objectManager.pathSectionObjects.set(pathSectionObject.id, pathSectionObject);

        return pathSectionObject;
    }
}

const customDotPathBuilder = new CustomDotPathBuilder();
export default customDotPathBuilder;
