import React from 'react';

type Props = {
  className?: string;
};

export default function Logo({ className = '' }: Props) {
  return (
    <img
      src={'https://saashqdev.com/logo.svg'}
      className={className}
      alt={'saashqdev logo'}
    ></img>
  );
}
