import React, { useState, useEffect } from 'react';
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
  Tabs,
  Tab,
  TabTitleText,
  Tooltip,
} from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import ProxmoxComputeSelectors from './ProxmoxComputeSelectors';
import ProxmoxServerStorage from './ProxmoxServer/ProxmoxServerStorage';
import ProxmoxServerOptions from './ProxmoxServer/ProxmoxServerOptions';
import ProxmoxServerNetwork from './ProxmoxServer/ProxmoxServerNetwork';
import ProxmoxServerHardware from './ProxmoxServer/ProxmoxServerHardware';
import ProxmoxServerCloudinit from './ProxmoxServer/ProxmoxServerCloudinit';
import ProxmoxContainerNetwork from './ProxmoxContainer/ProxmoxContainerNetwork';
import ProxmoxContainerOptions from './ProxmoxContainer/ProxmoxContainerOptions';
import ProxmoxContainerStorage from './ProxmoxContainer/ProxmoxContainerStorage';
import ProxmoxContainerHardware from './ProxmoxContainer/ProxmoxContainerHardware';
import InputField from './common/FormInputs';
import { connect } from 'react-redux';

const ProxmoxVmType = ({
  vm_attributes,
  nodes,
  images,
  pools,
  from_profile,
  new_vm,
  storages,
  bridges,
  hasCloudinit,
}) => {
  const nodesMap = nodes ? nodes.map(node => ({ value: node.node, label: node.node })) : [];
  const imagesMap = images ? images.map(image => ({
    value: image.uuid,
    label: image.name,
  })) : [];
  const poolsMap = pools ? pools.map(pool => ({
    value: pool.poolid,
    label: pool.poolid,
  })) : [];
  const [activeTabKey, setActiveTabKey] = useState(0);
  const handleTabClick = (event, tabIndex) => {
    setActiveTabKey(tabIndex);
  };
  const [vmAttributes, setVmAttributes] = useState(vm_attributes);
  const [general, setGeneral] = useState(vm_attributes);
  const image = '';
  const paramScope = from_profile
    ? 'compute_attribute[vm_attrs]'
    : 'host[compute_attributes]';
  const filteredBridges = bridges.filter(bridge => bridge.node_id === general?.node_id?.value);
  const handleAttributeChange = (key, newValues) => {
    setVmAttributes({
      ...vmAttributes,
      [key]: newValues,
    });
  };
  const componentMap = {
    qemu: {
      options: <ProxmoxServerOptions options={vmAttributes} />,
      hardware: <ProxmoxServerHardware hardware={vmAttributes} />,
      network: (
        <ProxmoxServerNetwork
          network={vmAttributes?.interfaces || {} }
          bridges={filteredBridges}
          from_profile={from_profile}
          paramScope={paramScope}
        />
      ),
      storage: (
        <ProxmoxServerStorage
          storage={vmAttributes?.disks || {} }
          storages={storages}
          from_profile={from_profile}
          nodeId={general?.node_id?.value}
          paramScope={paramScope}
        />
      ),
    },
    lxc: {
      options: <ProxmoxContainerOptions options={vmAttributes} storages={storages} paramScope={paramScope} nodeId={general?.node_id?.value}/>,
      hardware: <ProxmoxContainerHardware hardware={vmAttributes} paramScope={paramScope}/>,
      network: (
        <ProxmoxContainerNetwork
          network={vmAttributes?.interfaces || {}}
          bridges={filteredBridges}
          from_profile={from_profile}
          paramScope={paramScope}
        />
      ),
      storage: <ProxmoxContainerStorage storage={vmAttributes?.disks || {}} from_profile={from_profile} storages={storages} nodeId={general?.node_id?.value} paramScope={paramScope}/>,
    },
  };

  const handleChange = e => {
    const { name, value } = e.target;
    const updatedKey = Object.keys(general).find(
      key => general[key].name === name
    );

    setGeneral(prevGeneral => ({
      ...prevGeneral,
      [updatedKey]: { ...prevGeneral[updatedKey], value },
    }));
  };

  const filterCloudinit = vmAttributes ? (Object.keys(vmAttributes)
    .filter(key => ['ciuser', 'cipassword', 'nameserver', 'searchdomain', 'sshkeys'].includes(key))
    .reduce((obj, key) => {
      obj[key] = vmAttributes[key];
      return obj;
    }, {})) : {};

  return (
    <div>
      <InputField
        name={general?.type?.name}
        label={__('Type')}
        info={__("test info box")}
        required
        onChange={e => handleChange(e)}
        value={general?.type?.value}
        options={ProxmoxComputeSelectors.proxmoxTypesMap}
        type="select"
      />
      <Tabs
        activeKey={activeTabKey}
        onSelect={handleTabClick}
        aria-label="Tabs in the default example"
        role="region"
      >
        <Tab
          eventKey={0}
          title={<TabTitleText>General</TabTitleText>}
          aria-label="Default content - general"
        >
          <PageSection padding={{ default: 'noPadding' }}>
            <Divider component="li" style={{ marginBottom: '2rem' }} />
            <InputField
              name={general.vmid.name}
              label={__('VM ID')}
              required
              value={general.vmid.value}
              onChange={handleChange}
            />
            <InputField
              name={general.node_id.name}
              label={__('Node')}
              required
              type="select"
              value={general.node_id.value}
              options={nodesMap}
              onChange={handleChange}
            />
            <InputField
              name={general.pool.name}
              label={__('Pool')}
              type="select"
              value={general.pool.value}
              options={poolsMap}
              onChange={handleChange}
            />
            {from_profile && (
              <InputField
                name="image"
                label={__('Image')}
                type="select"
                value={image}
                options={imagesMap}
                onChange={handleChange}
              />
            )}
            <InputField
              name={general.description.name}
              label={__('Description')}
              type="textarea"
              value={general.description.value}
              onChange={handleChange}
            />
          </PageSection>
        </Tab>
        <Tab
          eventKey={1}
          title={<TabTitleText>Advanced Options</TabTitleText>}
          aria-label="advanced options"
        >
          <PageSection padding={{ default: 'noPadding' }}>
            <Divider component="li" style={{ marginBottom: '2rem' }} />
            {componentMap[general.type.value]?.options}
          </PageSection>
        </Tab>
        <Tab
          eventKey={2}
          title={<TabTitleText>Hardware</TabTitleText>}
          aria-label="hardware"
        >
          <PageSection padding={{ default: 'noPadding' }}>
            <Divider component="li" style={{ marginBottom: '2rem' }} />
            {componentMap[general.type.value]?.hardware}
          </PageSection>
        </Tab>
        {from_profile && (
          <Tab
            eventKey={3}
            title={<TabTitleText>Network Interfaces</TabTitleText>}
            aria-label="Network interface"
          >
            <PageSection padding={{ default: 'noPadding' }}>
              <Divider component="li" style={{ marginBottom: '2rem' }} />
              {componentMap[general.type.value]?.network}
            </PageSection>
          </Tab>
        )}
        <Tab
          eventKey={4}
          title={<TabTitleText>Storage</TabTitleText>}
          aria-label="storage"
        >
          <PageSection padding={{ default: 'noPadding' }}>
            <Divider component="li" style={{ marginBottom: '2rem' }} />
            {componentMap[general.type.value]?.storage}
          </PageSection>
        </Tab>
        {general.type.value === 'qemu' && (
          <Tab
            eventKey={5}
            title={<TabTitleText>{__('Cloudinit')}</TabTitleText>}
            aria-label="Cloudinit"
          >
            <PageSection padding={{ default: 'noPadding' }}>
              <Divider component="li" style={{ marginBottom: '2rem' }} />
              <ProxmoxServerCloudinit
                cloudinit={vm_attributes.disks}
                additionalData={filterCloudinit}
                storages={storages}
                from_profile={from_profile}
                hasCloudinit={hasCloudinit}
              />
            </PageSection>
          </Tab>
        )}
      </Tabs>
    </div>
  );
};

export default ProxmoxVmType;
