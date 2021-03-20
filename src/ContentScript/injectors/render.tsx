import React from 'react';
import ReactDOM from 'react-dom';
import YoutubeButton from '../../component/youtube/index';

function renderComponent(element: React.ReactElement, container: HTMLElement) {
  ReactDOM.render(<React.StrictMode>{element}</React.StrictMode>, container);
}

export function renderYouTubeButton(likerId: string, container: HTMLElement) {
  renderComponent(<YoutubeButton likerId={likerId} />, container);
}
