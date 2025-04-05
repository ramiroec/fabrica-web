import React, { useState } from 'react';
import { ContentHeader } from '@components';

const Blank = () => {
  return (
    <div>
      <ContentHeader title="Blank Page" />
      <section className="content">
        <div className="container-fluid">
          <div>
            <div className="card-header">
              <h3 className="card-title">Title</h3>
            </div>
            <div className="card-body">

            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blank;
