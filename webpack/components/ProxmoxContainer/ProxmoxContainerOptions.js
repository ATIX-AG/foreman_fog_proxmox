import React, { useState, useEffect } from 'react';
import InputField from '../common/FormInputs';
import ProxmoxComputeSelectors from '../ProxmoxComputeSelectors';
import {
  FormGroup,
  TextContent,
  Text,
  PageSection,
  Title,
  Divider,
  SelectOption,
  ExpandableSection,
  ExpandableSectionToggle,
} from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { createStoragesMap } from '../ProxmoxStoragesUtils';
import { imagesByStorage } from '../ProxmoxStoragesUtils';
const ProxmoxContainerOptions = ({ options, storages, nodeId }) => {
  const [opts, setOpts] = useState(options);
  const storagesMap = createStoragesMap(storages, 'vztmpl', nodeId);
  const volumesMap = imagesByStorage(storages, nodeId, 'local', 'vztmpl');
  const handleChange = e => {
    const { name, value } = e.target;
    const updatedKey = Object.keys(opts).find(key => opts[key].name === name);

    setGeneral(prevOpts => ({
      ...prevOpts,
      [updatedKey]: { ...prevOpts[updatedKey], value },
    }));
  };

  return (
    <div>
      <InputField
        name={opts?.ostemplate_storage?.name}
        label={__('Template Storage')}
        value={opts?.ostemplate_storage?.value}
        options={storagesMap}  
        type="select"
        onChange={handleChange}
      />
      <InputField
        name={opts?.ostemplate_file?.name}
        label={__('OS Template')}
        required
        value={opts?.ostemplate_file?.value}
        type="select"
        onChange={handleChange}
      />
      <InputField
        name={opts?.password?.name}
        label={__('Root Password')}
        required
        value={opts?.password?.value}
        onChange={handleChange}
      />
      <InputField
        name={opts.onboot.name}
        label={__('Start at boot')}
        type="checkbox"
        value={opts.onboot.value}
        onChange={handleChange}
      />
      <InputField
        name={opts.ostype.name}
        label={__('OS Type')}
        type="select"
        options={ProxmoxComputeSelectors.proxmoxOperatingSystemsMap}
        value={opts.ostype.value}
        onChange={handleChange}
      />
      <InputField
        name={opts.hostname.name}
        label={__('Hostname')}
        value={opts.hostname.value}
        onChange={handleChange}
      />
      <InputField
        name={opts.nameserver.name}
        label={__('DNS server')}
        value={opts.nameserver.value}
        onChange={handleChange}
      />
      <InputField
        name={opts.searchdomain.name}
        label={__('Search Domain')}
        value={opts.searchdomain.value}
        onChange={handleChange}
      />
    </div>
  );
};

export default ProxmoxContainerOptions;
