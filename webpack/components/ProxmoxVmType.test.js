import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProxmoxVmType from './ProxmoxVmType';

const props = {
  vm_attributes: {
    type: { name: 'type', value: 'qemu' },
    vmid: { name: 'vmid', value: '101' },
    node_id: { name: 'node_id', value: 'node1' },
    pool: { name: 'pool', value: 'pool1' },
    description: { name: 'description', value: 'Test VM' },
    interfaces: [],
    disks: [],
  },
  nodes: [{ node: 'node1' }, { node: 'node2' }],
  images: ['image1', 'image2'],
  pools: [{ poolid: 'pool1' }, { poolid: 'pool2' }],
  from_profile: false,
  new_vm: false,
  storages: [],
  bridges: [],
  volids: [],
};

test('ProxmoxVmType should match snapshot', () => {
  const { asFragment } = render(<ProxmoxVmType {...props} />);
  expect(asFragment()).toMatchSnapshot();
});

test('renders ProxmoxVmType component', () => {
  render(<ProxmoxVmType {...props} />);
  expect(screen.getByLabelText('Type')).toBeInTheDocument();
  expect(screen.getByLabelText('VM ID')).toBeInTheDocument();
});

test('changes active tab on tab click', () => {
  render(<ProxmoxVmType {...props} />);
  fireEvent.click(screen.getByRole('tab', { name: /Advanced Options/i }));
  expect(
    screen.getByRole('tabpanel', { name: /Advanced Options/i })
  ).toBeVisible();
});

test('handles input changes', () => {
  render(<ProxmoxVmType {...props} />);
  const typeInput = screen.getByLabelText('Type');
  fireEvent.change(typeInput, { target: { value: 'new-type' } });
  expect(typeInput.value).toBe('new-type');
});
