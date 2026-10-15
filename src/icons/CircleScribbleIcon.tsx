import type * as React from 'react';

export function CircleScribbleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      {...props}
    >
      <path
        d="M22.3098 45.2727C34.7709 45.2727 41.7802 38.2036 41.7802 25.6364C41.7802 13.0691 34.7709 6 22.3098 6C9.84871 6 2.83936 13.0691 2.83936 25.6364C2.83936 38.2036 9.84871 45.2727 22.3098 45.2727Z"
        fill="#CEF2D8"
      />
      <path
        d="M12.5747 22.1594L24.375 33.8184C29.9277 18.5361 34.5523 11.8301 45.0254 2.72754"
        stroke="#015B49"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M40.5601 17.4694C41.3661 19.8518 41.7802 22.5817 41.7802 25.6364C41.7802 38.2036 34.7709 45.2727 22.3098 45.2727C9.84871 45.2727 2.83936 38.2036 2.83936 25.6364C2.83936 13.0691 9.84871 6 22.3098 6C25.8021 6 28.8662 6.55525 31.4678 7.63113"
        stroke="#015B49"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
