import { css } from 'lit-element';

export default css`:host {
  display: flex;
  flex-direction: column;
  color: var(--exchange-search-panel-font-color, inherit);
}

.header {
  display: flex;
  flex-direction: row;
  align-items: center;
}

h2 {
  font-size: var(--arc-font-headline-font-size);
  font-weight: var(--arc-font-headline-font-weight);
  letter-spacing: var(--arc-font-headline-letter-spacing);
  line-height: var(--arc-font-headline-line-height);
  flex: 1;
}

[hidden] {
  display: none !important;
}

paper-progress {
  width: 100%;
}

anypoint-icon-button.toggle-view {
  border-radius: 50%;
  min-width: 40px;
  min-height: 40px;
}

.error-toast {
  background-color: var(--warning-primary-color, #FF7043);
  color: var(--warning-contrast-color, #fff);
}

.empty-info {
  font-size: 16px;
}

.header-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.search-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.search-bar paper-input-container {
  flex: 1;
}

.list {
  color: inherit;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.list[data-list] {
  display: flex;
  flex-direction: column;
}

exchange-search-grid-item {
  width: calc(var(--exchange-search-grid-item-computed-width, 25%) - 16px);
  margin: 8px;
}

.paper-item {
  cursor: pointer;
}

.load-more {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

.auth-button {
  margin-right: 8px;
}

.exchange-icon {
  margin-right: 8px;
}

.connecting-info {
  width: 320px;
  margin: 0 auto;
  text-align: center;
}

.icon {
  display: block;
  width: 24px;
  height: 24px;
  fill: currentColor;
}`;
