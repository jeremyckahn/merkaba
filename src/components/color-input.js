import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import { ChromePicker } from 'react-color';

export const ColorInput = ({
  value,
  name,
  handlePropertyChange,
  handleColorPropertyChange,
}) =>
  <span>
    <input
      data-tip
      data-for="colorpicker-tooltip"
      data-event="focus"
      data-event-off="blur"
      name={name}
      value={value}
      onChange={handlePropertyChange}
    />
    <ReactTooltip
      id="colorpicker-tooltip"
      place="left"
      type="light"
      effect="solid"
      className="tooltip-class"
    >
      <ChromePicker
        color={value}
        onChange={
          color => handleColorPropertyChange(color, name)
        }
      />
    </ReactTooltip>
  </span>
