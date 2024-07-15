Deface::Override.new(
  :virtual_path => 'hosts/_compute',
  :name => 'update_react_component_to_virtual_machine_tab',
  :replace => "erb[loud]:contains('hosts/compute_detail')",
  :partial => 'compute_resources_vms/form/proxmox/update_react_component_to_host_form',
)
