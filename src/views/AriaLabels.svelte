<script>
  import FormUnit from './forms-controls/FormUnit';
  
  const defaultLabels = {
    alt: null,
    visible: true,
    a11y: null,
  };

  export let invertView = false;
  export let itemId = null;
  export let itemIsLocked;
  export let overrides;
  export let role;
  export let savedLabels = { ...defaultLabels };
  export let labels = { ...defaultLabels };
</script>

{#if (labels && role !== 'image-decorative')}
  {#if (role === 'image')}
    <FormUnit
      className="form-row form-unit fixed-150"
      kind="inputText"
      labelText="Alt text"
      nameId={`${itemId}-label-alt`}
      placeholder="Short description of the scene"
      invertView={invertView}
      itemIsLocked={itemIsLocked}
      hasMultiple={overrides.includes('labels-alt')}
      isDirty={savedLabels.alt !== labels.alt}
      bind:value={labels.alt}
      preserveDirtyProp={true}
      a11yField={true}
    />
  {:else}
    <FormUnit
      className="form-row form-unit fixed-150"
      kind="inputSwitch"
      labelText="Visible label"
      nameId={`${itemId}-label-visible`}
      placeholder="Leave empty to use a11y label"
      invertView={invertView}
      itemIsLocked={itemIsLocked}
      hasMultiple={overrides.includes('labels-visible')}
      isDirty={savedLabels.visible !== labels.visible}
      bind:value={labels.visible}
      preserveDirtyProp={true}
      a11yField={true}
    />
    <FormUnit
      className="form-row form-unit fixed-150"
      kind="inputText"
      labelText="A11y label"
      nameId={`${itemId}-label-a11y`}
      placeholder="Leave empty to use visible label"
      invertView={invertView}
      itemIsLocked={itemIsLocked}
      hasMultiple={overrides.includes('labels-a11y')}
      isDirty={savedLabels.a11y !== labels.a11y}
      bind:value={labels.a11y}
      preserveDirtyProp={true}
      a11yField={true}
    />
  {/if}
{/if}
