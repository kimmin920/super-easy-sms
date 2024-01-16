import React, { useLayoutEffect, useRef } from 'react';
import { CellProps, Column } from 'react-datasheet-grid';
import Select from 'react-select';

function SelectWidget({
  focus,
  rowData,
  columnData,
  stopEditing,
  setRowData,
}: CellProps<unknown, SelectOptions>) {
  const ref = useRef<Select>(null);

  // This function will be called only when `focus` changes
  useLayoutEffect(() => {
    if (focus) {
      ref.current?.focus();
    } else {
      ref.current?.blur();
    }
  }, [focus]);

  const { choices } = columnData;

  return (
    <Select
      isMulti
      // className='basic-multi-select'
      // classNamePrefix='select'
      ref={ref as any}
      onMenuClose={() => stopEditing({ nextRow: false })}
      menuIsOpen={focus}
      menuPortalTarget={document.body}
      options={choices}
      value={choices.filter((choice) => rowData.includes(choice.value))}
      onChange={(selectedOptions) => {
        console.log('onchange', selectedOptions);
        const values = selectedOptions.map((option) => option.value);

        setRowData(values);
        // We don't just do `stopEditing()` because it is triggered too early by react-select
        setTimeout(stopEditing, 0);
      }}
      styles={{
        container: (provided) => ({
          ...provided,
          flex: 1,
          alignSelf: 'stretch',
          pointerEvents: focus ? undefined : 'none',
        }),
        control: (provided) => ({
          ...provided,
          height: '100%',
          border: 'none',
          boxShadow: 'none',
          background: 'none',
        }),
        indicatorSeparator: (provided) => ({
          ...provided,
          opacity: 0,
        }),
        clearIndicator: (provided) => ({
          display: 'none',
        }),
      }}
    />
  );
}

const SelectColumn = React.memo(SelectWidget);

export default SelectColumn;

type SelectOptions = {
  choices: typeof choices;
  // Let's add more options!
  disabled?: boolean;
};

export const selectColumn = (
  // We receive the options as a parameter to create the column object
  options: SelectOptions
): Column<string | null, SelectOptions> => ({
  component: SelectWidget,
  // We pass the options to the cells using the `columnData`property
  columnData: options,
  // We set other column properties so we don't have to do it manually everytime we use the column
  disableKeys: true,
  keepFocus: true,
  // We can also use the options to customise some properties
  disabled: options.disabled,
  deleteValue: () => null,
  copyValue: ({ rowData }) => {
    return rowData.map(
      (each) => options.choices.find((choice) => choice.value === each)?.label
    );
  },
  pasteValue: ({ value }) => {
    const valueArray = value.split(',');
    return options.choices
      .filter((choice) => valueArray.includes(choice.value))
      .map((each) => each.value);
  },
});
