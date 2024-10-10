import React from 'react';

type Props = {
  className?: string;
};

export default function Logo({ className = '' }: Props) {
  return (
    <img
      src={'https://saashqdev.org/logo.svg'}
      className={className}
      alt={'SaasHQ Logo'}
    ></img>
  );
}
