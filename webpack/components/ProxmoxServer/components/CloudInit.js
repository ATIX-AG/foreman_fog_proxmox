import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Title, Divider, PageSection } from '@patternfly/react-core';
import InputField from '../../common/FormInputs';
import ProxmoxComputeSelectors from '../../ProxmoxComputeSelectors';
import { TimesIcon } from '@patternfly/react-icons/dist/esm/icons/times-icon';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import { number_to_human_size } from 'number_helpers';
import { createStoragesMap } from '../../ProxmoxStoragesUtils';
const CloudInit = ({ onRemove, data, storages, hasCloudinit, nodeId }) => {
  const [opts, setOpts] = useState(data);
 
  const handleChange = e => {
    const { name, type } = e.target;
    const value = e.target.value;
    const updatedKey = Object.keys(opts).find(key => opts[key].name === name);
    const updatedData = {
      ...opts,
      [updatedKey]: { ...opts[updatedKey], value },
    };
    setOpts(updatedData);
  };
  const storagesMap = createStoragesMap(storages, null, nodeId);

  return (
    <div>
      <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
        <button onClick={onRemove}>
          <TimesIcon />
        </button>
      </div>
          <>
            <InputField
              name={opts.storage.name}
              label={__("Storage")}
              type="select"
              value={opts.storage.value}
              disabled={hasCloudinit}
              options={storagesMap}
              onChange={handleChange}
            />
            <InputField
              name={opts.controller.name}
              label={__("Controller")}
              type="select"
              disabled={hasCloudinit}
              options={ProxmoxComputeSelectors.proxmoxControllersHDDMap}
              value={opts.controller.value || 'ide'}
              onChange={handleChange}
            />
            <input
              name={opts.device.name}
              type="hidden"
              value={opts.device.value || '0'}
              onChange={handleChange}
            />
            <input
              name={opts.storage_type.name}
              type="hidden"
              value={opts.storage_type.value}
              onChange={handleChange}
            />
            <input
              name={opts.volid.name}
              type="hidden"
              value={opts.volid.value}
              onChange={handleChange}
            />
            <input
              name={opts.id.name}
              type="hidden"
              value={opts.id.value || 'ide0'}
              onChange={handleChange}
            />
            {hasCloudinit && (
              <>
                <InputField
                  name={opts.ciuser.name}
                  label={__("User")}
                  value={opts.ciuser.value}
                  onChange={handleChange}
                />
                <InputField
                  name={opts.cipassword.name}
                  label={__("Password")}
                  value={opts.cipassword.value}
                  onChange={handleChange}
                />
                <InputField
                  name={opts.searchdomain.name}
                  label={__("DNS domain")}
                  value={opts.searchdomain.value}
                  onChange={handleChange}
                />
                <InputField
                  name={opts.nameserver.name}
                  label={__("DNS servers")}
                  value={opts.nameserver.value}
                  onChange={handleChange}
                />
                <InputField
                  name={opts.sshkeys.name}
                  label={__("SSH public key")}
                  value={opts.sshkeys.value}
                  onChange={handleChange}
                />
              </>
            )}
          </>
    </div>
  );
};

export default CloudInit;
