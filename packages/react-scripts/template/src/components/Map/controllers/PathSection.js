import { Vector3 } from 'three';

/**
 * @public
 * @hideconstructor
 */
class PathSection {
  /**
   *
   * @param {AdsumLocation} from
   * @param {SiteObject|FloorObject} ground
   * @param {AdsumLocation} to
   * @param {PathNode[]} nodes
   */
  constructor(from = null, ground = null, to = null, nodes = []) {
    /**
     * @public
     * @readonly
     * @type {AdsumLocation}
     */
    this.from = from;

    /**
     * @public
     * @readonly
     * @type {AdsumLocation}
     */
    this.to = to;

    /**
     * @public
     * @readonly
     * @type {SiteObject|FloorObject}
     */
    this.ground = ground;

    /**
     * @package
     * @readonly
     * @type {PathNode[]}
     */
    this.nodes = nodes;

    /**
     * @private
     *
     * @type {number}
     */
    this._distance = null;

    /**
     * @private
     *
     * @type {THREE.Curve}
     */
    this._curve = null;
  }

  /**
   * @public
   *
   * @return {number}
   */
  getDistance() {
    if (this._distance === null) {
      this._distance = 0;

      for (let i = 0; i < this.nodes.length - 1; i++) {
        const linkToNext = this.nodes[i].getLinkTo(this.nodes[i + 1]);
        this._distance += linkToNext.distance;
      }
    }

    return this._distance;
  }

  /**
   * @package
   * @return {THREE.Curve|null}
   */
  getCurve() {
    if (this.nodes.length < 2) {
      return null;
    }

    if (this._curve === null) {
      this._curve = [];
      // TODO: Handle not drawable nodes
      for (let i = 0; i < this.nodes.length - 1; i++) {
        this._curve.push({
          from: this.nodes[i].groundPosition,
          to: this.nodes[i + 1].groundPosition,
          ground: this.nodes[i + 1].ground,
        });
      }
    }

    return this._curve;
  }

  /**
   * @package
   *
   * @param {number} interval
   * @param {AdsumProjector} projector
   * @return {THREE.Vector3[]}
   */
  interpolate(interval, projector) {
    const curve = this.getCurve();

    if (curve === null) {
      return [];
    }

    let idealInterval = interval;
    if (interval > this.getDistance() / 3) {
      console.warn('AdsumWebMap.PathSection.interpolate: short pathSection');
      idealInterval = this.getDistance() / 3;
    }

    const numberOfPoints = Math.floor(this.getDistance() / idealInterval) - 1;
    const realInterval = this.getDistance() / (numberOfPoints + 1);

    const points = [];
    let distanceToNextPoint = realInterval;
    const v = new Vector3();
    curve.forEach(({ from, to, ground }) => {
      const l = projector.adsumDistanceToMeter(v.subVectors(from, to).length());

      if (l < distanceToNextPoint) {
        distanceToNextPoint -= l;

        return;
      }

      let alpha = distanceToNextPoint / l;
      while (alpha <= 1) {
        v.lerpVectors(from, to, alpha);
        points.push({
            position: v.clone(),
            ground
        });

        alpha += realInterval / l;
      }

      distanceToNextPoint = l * (alpha - 1);
    });

    return points;
  }
}

export default PathSection;
