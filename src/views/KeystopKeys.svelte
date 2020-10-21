<script>
  import { afterUpdate, beforeUpdate } from 'svelte';
  import FormUnit from './forms-controls/FormUnit';
  import { updateArray } from '../Tools';

  export let invertView = false;
  export let isEditor = false;
  export let itemId = null;
  export let options = null;
  export let optionsInit = null;
  export let keys = null;
  export let resetValue = false;
  export let setOptions = null;

  let newKeyValue = 'no-key';
  let dirtyKeys = keys ? [...keys] : [];
  let originalKeys = keys ? [...keys] : [];
  // tktk
  const hasMultiple = false;

  const addKey = (keyToAdd) => {
    // check for existing and add if it does not exist
    const keyIndex = dirtyKeys.findIndex(key => key === keyToAdd);
    if (keyIndex < 0) {
      dirtyKeys.push(keyToAdd);
    }
    newKeyValue = 'no-key';
  };

  const removeKey = (keyToRemove) => {
    const keyIndex = dirtyKeys.findIndex(key => key === keyToRemove);
    if (keyIndex > -1) {
      dirtyKeys = [
        ...dirtyKeys.slice(0, keyIndex),
        ...dirtyKeys.slice(keyIndex + 1),
      ];
    }
  };

  const updateKey = (currentKeys, keyToUpdate, oldKeyIndex) => {
    const oldKey = currentKeys[oldKeyIndex];
    if (oldKey !== keyToUpdate) {
      removeKey(oldKey);

      if (keyToUpdate !== 'no-key') {
        addKey(keyToUpdate);
      }
    }
  };

  const compareArrays = (array1, array2) => {
    let isDifferent = false;

    if (!array1 && !array2) {
      return isDifferent;
    }

    if (
      (!array1 && array2)
      || (!array2 && array1)
    ) {
      isDifferent = true;
      return isDifferent;
    }

    if (array1.length !== array2.length) {
      isDifferent = true;
      return isDifferent;
    }

    array1.forEach((value) => {
      const itemIndex = array2.findIndex(
        foundValue => (foundValue === value),
      );

      if (itemIndex < 0) {
        isDifferent = true;
      }
    });

    if (isDifferent) {
      return isDifferent;
    }

    array2.forEach((value) => {
      const itemIndex = array1.findIndex(
        foundValue => (foundValue === value),
      );

      if (itemIndex < 0) {
        isDifferent = true;
      }
    });

    return isDifferent;
  };

  const updateSelect = (params) => {
    const keyboardOptions = setOptions(options, 'space', isEditor);
    const keyboardOptionsInit = setOptions(optionsInit, 'no-key', isEditor);

    const currentKeys = params.keys;
    const selectType = params.type;
    let selectedValue = null;

    let modifiedSelectOptions = [...keyboardOptionsInit];
    if (selectType !== 'init') {
      modifiedSelectOptions = [...keyboardOptions];
      selectedValue = params.value;
    }

    if (currentKeys) {
      // remove existing key entries
      currentKeys.forEach((keyEntry) => {
        const compareValue = { value: keyEntry };
        if ((selectType === 'init') || (keyEntry !== selectedValue)) {
          modifiedSelectOptions = updateArray(
            modifiedSelectOptions,
            compareValue,
            'value',
            'remove',
          );
        }
      });

      // remove double dividers
      let lastIsDivider = false;
      modifiedSelectOptions.forEach((optionsEntry) => {
        const isDivider = optionsEntry.value.includes('divider--');

        if (isDivider && !lastIsDivider) {
          lastIsDivider = true;
        } else if (isDivider && lastIsDivider) {
          modifiedSelectOptions = updateArray(
            modifiedSelectOptions,
            optionsEntry,
            'value',
            'remove',
          );
        } else {
          lastIsDivider = false;
        }
      });

      // remove divider if it is last
      const lastOptionIndex = modifiedSelectOptions.length - 1;
      const lastOption = modifiedSelectOptions[lastOptionIndex];
      if (lastOption.value.includes('divider--')) {
        modifiedSelectOptions = updateArray(
          modifiedSelectOptions,
          lastOption,
          'value',
          'remove',
        );
      }
    }
    return modifiedSelectOptions;
  };

  beforeUpdate(() => {
    // check `keys` against original to see if it was updated on the Figma side
    if (compareArrays(keys, originalKeys)) {
      dirtyKeys = keys ? [...keys] : [];
      originalKeys = keys ? [...keys] : [];
      resetValue = true;
    }

    // check `keys` against dirty to see if it was updated in the plugin UI
    if (compareArrays(keys, dirtyKeys)) {
      keys = dirtyKeys ? [...dirtyKeys] : [];
      dirtyKeys = keys ? [...keys] : [];
      resetValue = true;
    }
  });

  afterUpdate(() => {
    if (resetValue) {
      resetValue = false;
    }
  });
</script>

{#each dirtyKeys as dirtyKey, i (dirtyKey)}
  <FormUnit
    className="form-row indent"
    on:deleteSignal={() => removeKey(dirtyKey)}
    disableActions={true}
    hasMultiple={isEditor && hasMultiple}
    hideLabel={true}
    isDeletable={true}
    invertView={invertView}
    itemIsLocked={false}
    kind="inputSelect"
    labelText="Add focus stop keys"
    nameId={`item-keystop-key-${dirtyKey}-${itemId}`}
    options={updateSelect({ keys, type: 'selected', value: dirtyKey })}
    resetValue={resetValue}
    selectWatchChange={true}
    on:changeSignal={() => updateKey(originalKeys, dirtyKey, i)}
    bind:value={dirtyKey}
  />
{/each}
<FormUnit
  className="form-row indent"
  disableActions={true}
  hasMultiple={isEditor && hasMultiple}
  hideLabel={true}
  invertView={invertView}
  itemIsLocked={false}
  kind="inputSelect"
  labelText="Add focus stop keys"
  nameId={`item-keystop-key-add-${itemId}`}
  options={updateSelect({ keys, type: 'init' })}
  resetValue={resetValue}
  selectWatchChange={true}
  on:changeSignal={() => addKey(newKeyValue)}
  bind:value={newKeyValue}
/>