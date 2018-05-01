import { sampleRect } from './test-utils.js';
import { computeMidDragMatrix } from '../src/utils';
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

  describe('computeMidDragMatrix', () => {});
});
