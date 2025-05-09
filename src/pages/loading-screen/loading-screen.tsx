import { createPortal } from 'react-dom';

// ----------------------------------------------------------------------

type Props = React.HTMLAttributes<HTMLDivElement> & {
  portal?: boolean;
  sx?: Record<string, any>;
};

export function LoadingScreen({ portal, className, ...other }: Props) {
  const content = (
    <div
      className={className}
      style={{
        paddingLeft: '1.25rem',
        paddingRight: '1.25rem',
        width: '100%',
        flexGrow: 1,
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      {...other}
    >
       <span className="loading loading-spinner loading-xl text-primary"></span>
    </div>
  );

  if (portal) {
    return createPortal(content, document.body);
  }

  return content;
}
