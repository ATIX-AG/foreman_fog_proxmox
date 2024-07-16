import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Title, Divider, PageSection } from '@patternfly/react-core';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import InputField from '../../common/FormInputs';
import ProxmoxComputeSelectors from '../../ProxmoxComputeSelectors';
import { createStoragesMap } from '../../ProxmoxStoragesUtils';
const HardDisk = ({
  id,
  data,
  storages,
  disks,
  updateHardDiskData,
  createUniqueDevice,
  nodeId
}) => {
  const [hdd, setHdd] = useState(data);
  const storagesMap = createStoragesMap(storages, null, nodeId);
  useEffect(() => {
    const currentHddData = JSON.stringify(hdd);
    const parentHddData = JSON.stringify(data);

    if (currentHddData !== parentHddData) {
      updateHardDiskData(id, hdd);
    }
  }, [hdd, id, data, updateHardDiskData]);
  const handleChange = e => {
    const { name, value } = e.target;
    const updatedKey = Object.keys(hdd).find(key => hdd[key].name === name);

    if (updatedKey === 'controller') {
      const updatedDeviceInfo = createUniqueDevice('hard_disk', value);
      if (updatedDeviceInfo) {
        setHdd({
          ...hdd,
          controller: { ...hdd.controller, value },
          device: { ...hdd.device, value: updatedDeviceInfo.device },
          id: { ...hdd.id, value: updatedDeviceInfo.id },
        });
      }
    } else {
      const updatedData = {
        ...hdd,
        [updatedKey]: { ...hdd[updatedKey], value },
      };
      setHdd(updatedData);
    }
  };
  return (
    <div>
      <Divider component="li" style={{ marginBottom: '2rem' }} />
      <input
        name={hdd.storage_type.name}
        type="hidden"
        value={hdd.storage_type.value}
        onChange={handleChange}
      />
      <input
        name={hdd.device.name}
        type="hidden"
        value={hdd.device.value}
        onChange={handleChange}
      />
      <input
        name={hdd.id.name}
        type="hidden"
        value={hdd.id.value}
        onChange={handleChange}
      />
      <InputField
        name={hdd.storage.name}
        label={__('Storage')}
        type="select"
        value={hdd.storage.value}
        options={storagesMap}
        onChange={handleChange}
      />
      <InputField
        name={hdd.controller.name}
        label={__('Controller')}
        type="select"
        value={hdd.controller.value}
        options={ProxmoxComputeSelectors.proxmoxControllersHDDMap}
        onChange={handleChange}
      />
      <InputField
        name={hdd.cache.name}
        label={__('Cache')}
        type="select"
        value={hdd.cache.value}
        options={ProxmoxComputeSelectors.proxmoxCachesMap}
        onChange={handleChange}
      />
      <InputField
        name={hdd.size.name}
        label={__('Size')}
        type="number"
        value={hdd.size.value}
        onChange={handleChange}
      />
    </div>
  );
};

export default HardDisk;
