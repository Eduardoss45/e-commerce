import React from 'react';

const ButtonToolbar = () => {
  return (
    <div className="d-flex justify-content-center my-3">
      <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
        <div className="btn-group" role="group" aria-label="First group">
          <button type="button" className="btn btn-primary">
            1
          </button>
          <button type="button" className="btn btn-primary">
            2
          </button>
          <button type="button" className="btn btn-primary">
            3
          </button>
          <button type="button" className="btn btn-primary">
            4
          </button>
        </div>
      </div>
    </div>
  );
};

export default ButtonToolbar;
