/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types'; // ES6
import * as CSS from 'csstype';
import i18n from 'i18next';
import { useTranslation, initReactI18next } from 'react-i18next';
import detector from 'i18next-browser-languagedetector';

import LikerButton from '../../sdk/button.iframe';
import translation from '../../i18n/config';

const lang = navigator.language;

i18n
  .use(detector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    whitelist: ['en', 'zh-TW', 'zh-CN'],
    resources: translation,
    lng: lang,
    fallbackLng: 'zh-TW',

    interpolation: {
      escapeValue: false,
    },
  });
i18n.changeLanguage();

const buttonContainer: CSS.Properties = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
};

const likerButton: CSS.Properties = {
  height: '200px',
  // overflow: 'hidden',
};

const likerTips: CSS.Properties = {
  // maxWidth: '480px',
  paddingLeft: '38px',
};

const likerTipsTitle: CSS.Properties = {
  color: '#333',
  fontSize: '18px',
  lineHeight: '1.5em',
  fontWeight: 600,
};

const likerTipsContent: CSS.Properties = {
  marginTop: '10pt',
};

const likerTipsContentList: CSS.Properties = {
  listStyle: 'none',
};
const likerTipsContentListItem: CSS.Properties = {
  marginTop: '10pt',
  display: 'flex',
  flexDirection: 'row',
  fontSize: '15px',
};
const likerTipsContentListItemImg: CSS.Properties = {
  marginRight: '5pt',
};

interface Props {
  likerId: string;
}

function YoutubeButton(props: Props) {
  const { likerId } = props;
  const { t } = useTranslation();

  const register = () => {
    window.open(`https://like.co/in/register`, '_blank');
  };
  useEffect(() => {
    const likerButtonInstance = new LikerButton({
      likerId,
      ref: document.querySelector('.liker-button') as HTMLElement,
    });
    likerButtonInstance.mount();
  }, [likerId]);
  return (
    <div style={buttonContainer}>
      <div className="liker-button" style={likerButton} />
      {likerId === 'likertemp' && (
        <div className="liker-tips" style={likerTips}>
          <div className="liker-tips-title" style={likerTipsTitle}>
            {t('YOUTUBE_TITLE')}
          </div>
          <div className="liker-tips-content" style={likerTipsContent}>
            <div>
              <ul style={likerTipsContentList}>
                <li style={likerTipsContentListItem} onClick={register}>
                  <img
                    style={likerTipsContentListItemImg}
                    alt="img"
                    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlPSIjMTZBMTIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiI+CiAgICAgICAgPHBhdGggZD0iTTcgMTJMMy45NTkgOC45NTlNNyAxMmw1LjUtNy41Ii8+CiAgICA8L2c+Cjwvc3ZnPgo="
                    role="presentation"
                    className="bullet"
                  />
                  {t('YOUTUBE_STEP1')}
                </li>
                <li style={likerTipsContentListItem}>
                  <img
                    style={likerTipsContentListItemImg}
                    alt="img"
                    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlPSIjMTZBMTIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiI+CiAgICAgICAgPHBhdGggZD0iTTcgMTJMMy45NTkgOC45NTlNNyAxMmw1LjUtNy41Ii8+CiAgICA8L2c+Cjwvc3ZnPgo="
                    role="presentation"
                    className="bullet"
                  />
                  {t('YOUTUBE_STEP2')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

YoutubeButton.propTypes = {
  likerId: PropTypes.string,
};

export default YoutubeButton;
