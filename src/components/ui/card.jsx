import PropTypes from 'prop-types';

export function Card({ className = '', children, ...props }) {
  return (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }) {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className = '', children, ...props }) {
  return (
    <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className = '', children, ...props }) {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
}

// Ajout des PropTypes pour chaque composant
Card.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
};

CardHeader.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
};

CardTitle.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
};

CardContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
};

// Valeurs par défaut
Card.defaultProps = {
  className: ''
};

CardHeader.defaultProps = {
  className: ''
};

CardTitle.defaultProps = {
  className: ''
};

CardContent.defaultProps = {
  className: ''
};