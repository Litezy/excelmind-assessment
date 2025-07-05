import { Listbox } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';
import React from 'react';
import clsx from 'clsx';

interface RoleDropdownProps {
  roles: string[];
  selectedRole: string;
  onChange: (role: string) => void;
}

const RoleDropdown: React.FC<RoleDropdownProps> = ({ roles, selectedRole, onChange }) => {
  return (
    <div className="w-full relative">
      <Listbox value={selectedRole} onChange={onChange}>
        <Listbox.Button className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200 pr-12 text-left relative">
          <span className="block truncate">
            {selectedRole ? selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1) : 'Select role'}
          </span>
          <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </span>
        </Listbox.Button>

        <Listbox.Options className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto focus:outline-none">
          {roles.map((role) => (
            <Listbox.Option
              key={role}
              value={role}
              className={({ active, selected }) =>
                clsx(
                  'cursor-pointer px-4 py-2 transition-all',
                  active ? 'bg-blue-100' : '',
                  selected ? 'font-medium text-blue-600' : 'text-gray-700'
                )
              }
            >
              {({ selected }) => (
                <div className="flex items-center justify-between">
                  <span>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </span>
                  {selected && <Check className="w-4 h-4 text-blue-500" />}
                </div>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
};

export default RoleDropdown;
