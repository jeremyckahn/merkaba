import React from 'react';
import { string } from 'prop-types';

/**
 * @function merkaba.Icon
 * @param {Object} props
 * @returns {Element}
 */
export const Icon = ({ type }) => (
  <i className={`glyphicon glyphicon-${type}`} />
);

Icon.propTypes = {
  type: string.isRequired,
};
