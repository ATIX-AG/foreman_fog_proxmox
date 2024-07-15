import React, { useState, useEffect } from 'react';
import NetworkInterface from './components/NetworkInterface';
import { Title, Divider, PageSection, Button } from '@patternfly/react-core';
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';
import CloudInit from './components/CloudInit';

const ProxmoxServerCloudinit = ({ cloudinit, storages, additionalData, from_profile, hasCloudinit, paramScope }) => {
  const [opts, setOpts] = useState(cloudinit);
  const [cloudInit, setCloudInit] = useState(false);
  const [cloudInitData, setCloudInitData] = useState(null);
  const [nextId, setNextId] = useState(0);
  useEffect(() => {
    if (cloudinit && cloudinit.length > 0) {
      cloudinit.forEach(disk => {
        if (disk.name === 'cloud_init') {
          addCloudInit(null, {...disk.value, ...additionalData}, true);
        }
      });
    }
  }, [cloudinit]);
  const addCloudInit = (event, initialData = null, isPreExisting = false) => {
    if (event) event.preventDefault();
    if (cloudInit) return;


    const initCloudinit = initialData || {
      id: {
        name: `${paramScope}[volumes_attributes][${nextId}][id]`,
        value: '',
      },
      volid: {
        name: `${paramScope}[volumes_attributes][${nextId}][volid]`,
        value: '',
      },
      storage_type: {
        name: `${paramScope}[volumes_attributes][${nextId}][storage_type]`,
        value: 'cloud_init',
      },
      storage: {
        name: `${paramScope}[volumes_attributes][${nextId}][storage]`,
        value: 'local',
      },
      device: {
        name: `${paramScope}[volumes_attributes][${nextId}][device]`,
        value: '',
      },
      controller: {
        name: `${paramScope}[volumes_attributes][${nextId}][controller]`,
        value: '',
      },
      ciuser: additionalData.ciuser,
      cipassword: additionalData.password,
      searchdomain: additionalData.searchdomain,
      nameserver: additionalData.nameserver,
      sshkeys: cloudinit.sshkeys
    };

    setCloudInit(true);
    setCloudInitData(initCloudinit);
  };
  const removeCloudInit = () => {
    setCloudInit(false);
  }
  return (
    <div>
       <PageSection padding={{ default: 'noPadding' }}>
        <Button
          onClick={addCloudInit}
          variant="secondary"
          isDisabled={cloudInit}
        >
          {' '}
          {__('Add Cloud-init')}{' '}
        </Button>
      {cloudInit && cloudInitData && (
          <CloudInit
            onRemove={removeCloudInit}
            data={cloudInitData}
            storages={storages}
            hasCloudinit={hasCloudinit}
          />
        )}
       </PageSection>
    </div>
  );
};

export default ProxmoxServerCloudinit;

