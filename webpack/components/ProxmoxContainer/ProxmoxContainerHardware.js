import React, { useState } from 'react';
import InputField from '../common/FormInputs';
import ProxmoxComputeSelectors from '../ProxmoxComputeSelectors';
import { PageSection, Title, Divider } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';

const ProxmoxContainerHardware = ({ hardware }) => {
  const [hw, setHw] = useState(hardware);

  const handleChange = e => {
    const { name, value } = e.target;
    const updatedKey = Object.keys(hw).find(key => hw[key].name === name);

    setHw(prevHw => ({
      ...prevHw,
      [updatedKey]: { ...prevHw[updatedKey], value },
    }));
  };

  return (
    <div>
      <PageSection padding={{ default: 'noPadding' }}>
        <Title headingLevel="h3">CPU</Title>
        <Divider component="li" style={{ marginBottom: '2rem' }} />
        <InputField
          name={hw.arch.name}
          label={__('Arctitecture')}
          type="select"
          options={ProxmoxComputeSelectors.proxmoxCpuFlagsMap}
          value={hw.arch.value}
          onChange={handleChange}
        />
        <InputField
          name={hw.cores.name}
          label={__('Cores')}
          type="number"
          value={hw.cores.value}
          onChange={handleChange}
        />
        <InputField
          name={hw.cpulimit.name}
          label={__('CPU limit')}
          type="number"
          value={hw.cpulimit.value}
          onChange={handleChange}
        />
        <InputField
          name={hw.cpuunits.name}
          label={__('CPU units')}
          type="number"
          value={hw.cpuunits.value}
          onChange={handleChange}
        />
      </PageSection>
      <PageSection padding={{ default: 'noPadding' }}>
        <Title headingLevel="h3">Memory</Title>
        <Divider component="li" style={{ marginBottom: '2rem' }} />
        <InputField
          name={hw.memory.name}
          label={__('Memory (MB)')}
          type="text"
          value={hw.memory.value}
          onChange={handleChange}
        />
        <InputField
          name={hw.swap.name}
          label={__('Swap (MB)')}
          type="text"
          value={hw.swap.value}
          onChange={handleChange}
        />
      </PageSection>
    </div>
  );
};

export default ProxmoxContainerHardware;
