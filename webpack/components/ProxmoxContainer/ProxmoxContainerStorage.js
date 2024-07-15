import React, { useState, useEffect } from 'react';
import {
  Button,
  Title,
  Divider,
  PageSection,
  ExpandableSection,
  ExpandableSectionToggle,
  Modal,
  ModalVariant,
} from '@patternfly/react-core';
import Select from 'foremanReact/components/common/forms/Select';
import TextInput from 'foremanReact/components/common/forms/TextInput';
import InputField from '../common/FormInputs';
import ProxmoxComputeSelectors from '../ProxmoxComputeSelectors';
import MountPoint from './MountPoint';
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';
import { translate as __ } from 'foremanReact/common/I18n';
import { createStoragesMap } from '../ProxmoxStoragesUtils';

const ProxmoxContainerStorage = ({ storage, from_profile, storages, nodeId, paramScope }) => {
  const initData = {
      id: {
        name: `${paramScope}[volumes_attributes][0][id]`,
        value: 'rootfs',
      },
      device: {
        name: `${paramScope}[volumes_attributes][0][device]`,
        value: '8',
      },
      storage: {
        name: `${paramScope}[volumes_attributes][0][storage]`,
        value: '',
      },
      size: {
        name: `${paramScope}[volumes_attributes][0][size]`,
        value: 8,
      }
    };

  const [rootfs, setRootfs] = useState(initData);

  useEffect(() => {
    if (storage && storage.length > 0) {
      storage.forEach(disk => {
        if (disk.name === 'rootfs') {
          setRootfs(disk.value);
        }
        if (disk.name === 'mount_point') {
          addMountPoint(null, disk.value, true);
        }
      });
    }
  }, [storage]);

  const handleChange = e => {
    const { name, value } = e.target;
    const updatedKey = Object.keys(rootfs).find(key => rootfs[key].name === name);
    const updatedData = {
      ...rootfs,
      [updatedKey]: { ...rootfs[updatedKey], value },
    };
    setRootfs(updatedData);
  };
  const [mountPoints, setMountPoints] = useState([]);
  const [nextId, setNextId] = useState(1);

  const storagesMap = createStoragesMap(storages, null, nodeId);
  const addMountPoint = (event, initialData = null) => {
    if (event) event.preventDefault();
    const initMP = initialData || {
      id: {
        name: `${paramScope}[volumes_attributes][${nextId}][id]`,
        value: `mp${nextId}`,
      },
      device: {
        name: `${paramScope}[volumes_attributes][${nextId}][device]`,
        value: `${nextId}`,
      },
      storage: {
        name: `${paramScope}[volumes_attributes][${nextId}][storage]`,
        value: '',
      },
      size: {
        name: `${paramScope}[volumes_attributes][${nextId}][size]`,
        value: 8,
      },
      volid: {
        name: `${paramScope}[volumes_attributes][${nextId}][volid]`,
        value: '',
      },
      mp: {
        name: `${paramScope}[volumes_attributes][${nextId}][mp]`,
        value: '',
      },
    };
    const newMountPoint = <MountPoint key={nextId} id={nextId} data={initMP} storagesMap={storagesMap} />;
    setMountPoints([...mountPoints, newMountPoint]);
    setNextId(prevId => prevId + 1);
  };

  const removeMountPoint = idToRemove => {
    const newMountPoints = mountPoints.filter(
      mountPoint => mountPoint.props.id !== idToRemove
    );
    setMountPoints(newMountPoints);
  };

  return (
    <div>
      <PageSection padding={{ default: 'noPadding' }}>
        <Title headingLevel="h3">Rootfs</Title>
        <Divider component="li" style={{ marginBottom: '2rem' }} />
        <InputField
          name={rootfs?.storage?.name}
          label="Storage"
          type="select"
          value={rootfs?.storage?.value}
          options={storagesMap}
          onChange={handleChange}
        />
        <InputField
          name={rootfs?.size?.name}
          label={__('Size')}
          type='number'
          value={rootfs?.size?.value}
          onChange={handleChange}
        />
        <input
        name={rootfs?.id?.name}
        type="hidden"
        value={rootfs?.id?.value}
        onChange={handleChange}
      />
      <input
        name={rootfs?.volid?.name}
        type="hidden"
        value={rootfs?.volid?.value}
        onChange={handleChange}
      />
      </PageSection>
      <PageSection padding={{ default: 'noPadding' }}>
        <Title headingLevel="h3">Storage</Title>
        <Divider component="li" style={{ marginBottom: '2rem' }} />
        <Button onClick={addMountPoint} variant="secondary">
          {__('Add MountPoint')}
        </Button>
        {mountPoints.map(mountPoint => (
          <div key={mountPoint.props.id} style={{ position: 'relative' }}>
            <div
              style={{
                marginTop: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Title headingLevel="h4"> Mount Point {mountPoint.props.id} </Title>
              <button
                onClick={() => removeMountPoint(mountPoint.props.id)}
                variant="plain"
              >
                <TimesIcon />
              </button>
            </div>
            {mountPoint}
          </div>
        ))}
      </PageSection>
    </div>
  );
};

export default ProxmoxContainerStorage;
