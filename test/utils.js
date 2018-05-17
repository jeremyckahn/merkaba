import { sampleRect } from './test-utils.js';
import {
  computeMidDragMatrix,
  computeUnrotatedBoundingBox,
  doRectsIntersect,
} from '../src/utils';
import assert from 'assert';

describe('utils', () => {
  describe('computeMidDragMatrix', () => {
    let transformData;

    const dragDeltaX = 30;
    const dragDeltaY = 30;

    describe('draggedHandleOrientation === "top-left"', () => {
      beforeEach(() => {
        transformData = computeMidDragMatrix(
          sampleRect(),
          'top-left',
          dragDeltaX,
          dragDeltaY
        );
      });

      it('computes the correct data', () => {
        const { a, b, c, d, e, f } = transformData;
        assert.deepEqual(
          { a, b, c, d, e, f },
          {
            a: -2,
            b: 0,
            c: 0,
            d: -2,
            e: 60,
            f: 75,
          }
        );
      });
    });

    describe('draggedHandleOrientation === "top-right"', () => {
      beforeEach(() => {
        transformData = computeMidDragMatrix(
          sampleRect(),
          'top-right',
          dragDeltaX,
          dragDeltaY
        );
      });

      it('computes the correct data', () => {
        const { a, b, c, d, e, f } = transformData;
        assert.deepEqual(
          { a, b, c, d, e, f },
          {
            a: 4,
            b: 0,
            c: 0,
            d: -2,
            e: -30,
            f: 75,
          }
        );
      });
    });

    describe('draggedHandleOrientation === "bottom-right"', () => {
      beforeEach(() => {
        transformData = computeMidDragMatrix(
          sampleRect(),
          'bottom-right',
          dragDeltaX,
          dragDeltaY
        );
      });

      it('computes the correct data', () => {
        const { a, b, c, d, e, f } = transformData;
        assert.deepEqual(
          { a, b, c, d, e, f },
          {
            a: 4,
            b: 0,
            c: 0,
            d: 4,
            e: -30,
            f: -45,
          }
        );
      });
    });

    describe('draggedHandleOrientation === "bottom-left"', () => {
      beforeEach(() => {
        transformData = computeMidDragMatrix(
          sampleRect(),
          'bottom-left',
          dragDeltaX,
          dragDeltaY
        );
      });

      it('computes the correct data', () => {
        const { a, b, c, d, e, f } = transformData;
        assert.deepEqual(
          { a, b, c, d, e, f },
          {
            a: -2,
            b: 0,
            c: 0,
            d: 4,
            e: 60,
            f: -45,
          }
        );
      });
    });
  });

  describe('computeUnrotatedBoundingBox', () => {
    let unrotatedBoundingBox;

    describe('no rotation', () => {
      beforeEach(() => {
        unrotatedBoundingBox = computeUnrotatedBoundingBox({
          rotate: 0,
          x: 0,
          y: 0,
          height: 100,
          width: 100,
        });
      });

      it('computes the unrotated bounding box', () => {
        assert.deepEqual(unrotatedBoundingBox, {
          x: 0,
          y: 0,
          height: 100,
          width: 100,
        });
      });
    });

    describe('half rotation', () => {
      beforeEach(() => {
        unrotatedBoundingBox = computeUnrotatedBoundingBox({
          rotate: 180,
          x: 0,
          y: 0,
          height: 100,
          width: 100,
        });
      });

      it('computes the unrotated bounding box', () => {
        assert.deepEqual(unrotatedBoundingBox, {
          x: 0,
          y: 0,
          height: 100,
          width: 100,
        });
      });
    });

    describe('rotation with different bounding box', () => {
      beforeEach(() => {
        unrotatedBoundingBox = computeUnrotatedBoundingBox({
          rotate: 45,
          x: 0,
          y: 0,
          height: 100,
          width: 100,
        });
      });

      it('computes the unrotated bounding box', () => {
        assert.deepEqual(unrotatedBoundingBox, {
          x: -21,
          y: -21,
          height: 141,
          width: 141,
        });
      });
    });
  });

  describe('doRectsIntersect', () => {
    let rectsIntersect;

    describe('rects do intersect', () => {
      beforeEach(() => {
        rectsIntersect = doRectsIntersect(
          { x: 0, y: 0, height: 100, width: 100 },
          { x: 50, y: 50, height: 100, width: 100 }
        );
      });

      it('computes correct result', () => {
        assert(rectsIntersect);
      });
    });

    describe('rects do not intersect', () => {
      beforeEach(() => {
        rectsIntersect = doRectsIntersect(
          { x: 0, y: 0, height: 100, width: 100 },
          { x: 150, y: 150, height: 100, width: 100 }
        );
      });

      it('computes correct result', () => {
        assert.equal(rectsIntersect, false);
      });
    });
  });
});
