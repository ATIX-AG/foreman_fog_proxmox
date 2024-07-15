import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Title, Divider, PageSection } from '@patternfly/react-core';
import InputField from '../../common/FormInputs';
import ProxmoxComputeSelectors from '../../ProxmoxComputeSelectors';
import { translate as __ } from 'foremanReact/common/I18n';

const NetworkInterface = ({
  id,
  networks,
  bridges,
  data,
  updateNetworkData,
}) => {
  const [network, setNetwork] = useState(data);

  useEffect(() => {
    const currentNetData = JSON.stringify(network);
    const parentNetData = JSON.stringify(data);

    if (currentNetData !== parentNetData) {
      updateNetworkData(id, network);
    }
  }, [network, id, data, updateNetworkData]);
  const handleChange = e => {
    const { name, type, checked } = e.target;
    const value = type === 'checkbox' ? (checked ? '1' : '0') : e.target.value;
    const updatedKey = Object.keys(network).find(
      key => network[key].name === name
    );
    const updatedData = {
      ...network,
      [updatedKey]: { ...network[updatedKey], value },
    };
    setNetwork(updatedData);
  };
  const bridgesMap = bridges.map(bridge => ({
    value: bridge.iface,
    label: bridge.iface,
  }));

  return (
    <div style={{ position: 'relative' }}>
      <Divider component="li" style={{ marginBottom: '2rem' }} />
      <InputField
        name={network.id.name}
        label={__('Indentifier')}
        info={__("net[n] with n integer >= 0, e.g. net0")}
        type="text"
        value={network.id.value}
        onChange={handleChange}
      />
      <InputField
        name={network.name.name}
        label={__('Name')}
        info={__("eth[n] with n integer >= 0, e.g. eth0")}
        type="text"
        value={network.name.value}
        onChange={handleChange}
      />
      <InputField
        name={network.bridge.name}
        label={__('Bridge')}
        type="select"
        options={bridgesMap}
        value={network.bridge.value}
        onChange={handleChange}
      />
      <InputField
        name={network?.dhcp?.name}
        label={__('DHCP IPv4')}
        type="checkbox"
        value={network?.dhcp?.value}
        checked={network?.dhcp?.value === '1'}
        onChange={handleChange}
      />
      <InputField
        name={network?.cidr?.name}
        label={__('CIDR IPv4')}
        info={__("integer within [0..32]")}
        type="text"
        value={network?.cidr?.value}
        onChange={handleChange}
      />
      <InputField
        name={network.gw.name}
        label={__('Gateway IPv4')}
        type="text"
        value={network.gw.value}
        onChange={handleChange}
      />
      <InputField
        name={network?.dhcp6?.name}
        label={__('DHCP IPv6')}
        type="checkbox"
        value={network?.dhcp6?.value}
        checked={network?.dhcp6?.value === '1'}
        onChange={handleChange}
      />
      <InputField
        name={network?.cidr6?.name}
        label={__('CIDR IPv6')}
        info={__("integer within [0..128]")}
        type="text"
        value={network?.cidr6?.value}
        onChange={handleChange}
      />
      <InputField
        name={network.gw6.name}
        label={__('Gateway IPv6')}
        type="text"
        value={network.gw6.value}
        onChange={handleChange}
      />
      <InputField
        name={network.tag.name}
        label={__('VLAN Tag')}
        type="text"
        value={network.tag.value}
        onChange={handleChange}
      />
      <InputField
        name={network.rate.name}
        label={__('Rate limit')}
        type="text"
        value={network.rate.value}
        onChange={handleChange}
      />
      <InputField
        name={network.firewall.name}
        label={__('Firewall')}
        type="checkbox"
        value={network.firewall.value}
        checked={network.firewall.value === '1'}
        onChange={handleChange}
      />
    </div>
  );
};

export default NetworkInterface;
