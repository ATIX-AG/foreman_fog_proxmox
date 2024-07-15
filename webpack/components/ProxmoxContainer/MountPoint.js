import React, { useState, useEffect } from 'react';
import { Divider } from '@patternfly/react-core';
import InputField from '../common/FormInputs';
import ProxmoxComputeSelectors from '../ProxmoxComputeSelectors';
import { translate as __ } from 'foremanReact/common/I18n';
const MountPoint = ({ id, data,  storagesMap }) => {
  const [mp, setMp] = useState(data);
  const handleChange = e => {
    const { name, value } = e.target;
    const updatedKey = Object.keys(mp).find(key => mp[key].name === name);
    const updatedData = {
      ...mp,
      [updatedKey]: { ...mp[updatedKey], value },
    };
    setMp(updatedData);
  };

  return (
    <div>
      <Divider component="li" style={{ marginBottom: '2rem' }} />
      <InputField
        name={mp.storage.name}
        label={__("Storage")}
        type="select"
        options={storagesMap}
        value={mp.storage.value}
        onChange={handleChange}
      />
      <InputField
        name={mp.mp.name}
        label={__('Path')}
        required
        value={mp.mp.value}
        onChange={handleChange}
      />
      <InputField
        name={mp.size.name}
        label={__('Size')}
        type="number"
        value={mp.size.value}
        onChange={handleChange}
      />
      <input
        name={mp.device.name}
        type="hidden"
        value={mp.device.value}
        onChange={handleChange}
      />
      <input
        name={mp.id.name}
        type="hidden"
        value={mp.id.value}
        onChange={handleChange}
      />
      <input
        name={mp.volid.name}
        type="hidden"
        value={mp.volid.value}
        onChange={handleChange}
      />
    </div>
  );
};

export default MountPoint;
