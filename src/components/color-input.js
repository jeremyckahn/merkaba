import React from 'react';
import { string, func } from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { ChromePicker } from 'react-color';

/**
 * @function merkaba.ColorInput
 * @param {Object} props
 * @returns {Element}
 */
export const ColorInput = ({
  value,
  name,
  handlePropertyChange,
  handleColorPropertyChange,
}) => (
  <span>
    <input
      data-event-off="blur"
      data-event="focus"
      data-for={`colorpicker-tooltip-${name}`}
      data-tip
      name={name}
      onChange={handlePropertyChange}
      value={value}
    />
    <ReactTooltip
      className="tooltip-class"
      effect="solid"
      id={`colorpicker-tooltip-${name}`}
      place="left"
      type="light"
    >
      <ChromePicker
        color={value}
        onChange={color => handleColorPropertyChange(color, name)}
      />
    </ReactTooltip>
  </span>
);

ColorInput.propTypes = {
  value: string.isRequired,
  name: string.isRequired,
  handlePropertyChange: func.isRequired,
  handleColorPropertyChange: func.isRequired,
};
