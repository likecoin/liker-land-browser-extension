import React from 'react';
import ReactDOM from 'react-dom';
import YoutubeButton from '../../component/youtube/index';

function renderComponent(likerId: string, ele: HTMLElement) {
  ReactDOM.render(
    <React.StrictMode>
      <YoutubeButton likerId={likerId} />
    </React.StrictMode>,
    ele
  );
}
export default renderComponent;
