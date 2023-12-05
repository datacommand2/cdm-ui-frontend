import { createGlobalStyle } from 'styled-components';
import { reset } from 'styled-reset';
import { dndSTyles } from './dndSTyle';
import { buttonProgress } from './buttonProgress';

interface GlobalStyleProps {
    thememode: string;
}

const GlobalStyle = createGlobalStyle<GlobalStyleProps>`

  ${reset};
  /* 아래에는 전역 스타일 작성 */
  :root {
    --font-muted: #9DA4AE;
    --dark-main: #111927;
    --light-main: #fff;
    --sidebar-width: 200px;
    --drawer-width: 200px;
    --table-width: 960px;
    --light-background: #EEF0F8;
    --dark-background: #0E1320;
    --light-border: rgba(0, 0, 0, 0.26);
    --dark-border: rgba(255, 255, 255, 0.33);
    --light-primary: #3699ff;
    --dark-primary: #90CAF9;
    --error: #d32f2f;
    --light-error: #d32f2f;
    --dark-error: #c62828;
    --light-warning: #ffa726;
    --dark-warning: #f57c00;
    --light-success: #00AB52;
    --dark-success: #388e3c;
    --light-font: #121212;
    --dark-font: #fff;
    --light-node: #fff;
    --dark-node: #343435;
    --light-node-font: #222;
    --dark-node-font: #f9f9f9;
    --light-node-border: #222;
    --light-flow-control-hover: #eee;
    --dark-flow-control-hover: #676768;
    --light-flow-control-boder: #ddd;
    --dark-flow-control-boder: #676768;
    --dark-node-border: #888;
    --light-disalbed: #E0E0E0;
    --dark-disabled: #2E3541;
    --light-disalbed-color: #A6A6A6;
    --dark-disabled-color: rgba(255, 255, 255, 0.3);
    --light-disalbed-border: rgba(0, 0, 0, 0.1);
    --dark-disabled-border: #2D3134;
    --light-table-title-bg: #e4e6ef;
    --dark-table-title-bg: #e4e6ef;
    --dark-select-bg: #111927;
    --light-completed-node: rgba(212, 235, 195, 0.9);
    --dark-completed-node: rgba(212, 255, 195, 0.7);
    --sidebar-hover: #252E3E;
    --sidebar-font: #9DA4AE;
    --light-sidebar-bg: #1C2536;
    --dark-sidebar-bg: #1C2536;
  }

  * {
    margin: 0;
    padding: 0;
    font-family: 'Noto Sans KR', 'Roboto', 'Poppins', sans-serif !important;
    &::-webkit-scrollbar {
      width: 12px !important;
      height: 12px !important;
    }
    &::-webkit-scrollbar-track {
      background-color: ${props => (props.thememode === 'dark' ? '#424242' : '#F1F1F1')} !important;
    }
    &::-webkit-scrollbar-thumb {
      background-color: ${props => (props.thememode === 'dark' ? '#686868' : '#C1C1C1')} !important;
    }
  }
  
  html,
  body {
    height: 100%;
    box-sizing: border-box;
    font-size: 12px;

    [hidden] {
      display: none;
    }
  }
  ${dndSTyles}
  ${buttonProgress}
  #root {
    height: 100%;
  }

  .light-large-sidebar {
    & .MuiDrawer-paper {
        padding-right: 16px;
        padding-left: 16px;
        background-color: var(--light-sidebar-bg);
        box-sizing: border-box;
        width: var(--sidebar-width);
        & div {
            color: var(--sidebar-font);
            & li {
                font-weight: 700;
            }
            & li.Mui-selected {
              background-color: var(--sidebar-hover);
                & .MuiListItemIcon-root {
                  color: var(--light-primary);
                }
                & .MuiListItemText-root {
                  color: var(--light-main);
                }
            }
            & li:hover {
              background-color: var(--sidebar-hover);
            }
        }
    }
  }
  .dark-large-sidebar {
    & .MuiDrawer-paper {
        padding-right: 16px;
        padding-left: 16px;
        background-color: var(--dark-sidebar-bg);
        box-sizing: border-box;
        width: var(--sidebar-width);
        & div {
            color: var(--sidebar-font);
            & li {
                font-weight: 700;
            }
            & li.Mui-selected {
              background-color: var(--sidebar-hover);
                & .MuiListItemIcon-root {
                  color: var(--dark-primary);
                }
                & .MuiListItemText-root {
                  color: var(--light-main);
                }
            }
            & li:hover {
              background-color: var(--sidebar-hover);
            }
        }
    }
  }
  .light-small-sidebar {
    & .MuiDrawer-paper {
        padding-right: 16px;
        padding-left: 16px;
        background-color: var(--light-sidebar-bg);
        box-sizing: border-box;
        width: var(--sidebar-width);
        & div {
            color: var(--sidebar-font);
            & li {
                font-weight: 700;
            }
            & li.Mui-selected {
              background-color: var(--sidebar-hover);
                & .MuiListItemIcon-root {
                  color: var(--light-primary);
                }
                & .MuiListItemText-root {
                  color: var(--light-main);
                }
            }
            & li:hover {
              background-color: var(--sidebar-hover);
            }
        }
    }
  }
  .dark-small-sidebar {
    & .MuiDrawer-paper {
        padding-right: 16px;
        padding-left: 16px;
        background-color: var(--dark-sidebar-bg);
        box-sizing: border-box;
        width: var(--sidebar-width);
        & div {
            color: var(--sidebar-font);
            & li {
                font-weight: 700;
            }
            & li.Mui-selected {
              background-color: var(--sidebar-hover);
                & .MuiListItemIcon-root {
                  color: var(--dark-primary);
                }
                & .MuiListItemText-root {
                  color: var(--light-main);
                }
            }
            & li:hover {
              background-color: var(--sidebar-hover);
            }
        }
    }
  }

  .light-react-flow-wrapper {
    border: 0.5px solid var(--light-border);
    & > div > .MuiBox-root {
      border-bottom: 1px solid var(--light-border);
    }
    & > aside > .MuiBox-root {
      border-bottom: 1px solid var(--light-border);
    }
    .validationflow .react-flow__handle-connecting {
      background-color: var(--light-error);
    }
  
    .validationflow .react-flow__handle-valid {
      background-color: var(--light-success);
    }
    .flow-detail {
      border-left: 1px solid var(--light-border);
    }
    .node {
      background-color: var(--light-node);
      color: var(--light-font);
      border: 1px solid var(--light-node-border);
    }
    
    .node-success,
    .node-succeed,
    .node-warning,
    .node-booting,
    .node-ready {
      background-color: var(--light-completed-node);
      color: var(--light-font);
      border: 1px solid var(--light-node-border);
    }
    .node-cancel,
    .node-cancel,
    .node-failed {
      background-color: var(--light-error);
      color: var(--dark-font);
      border: 1px solid var(--light-node-border);
    }
    .react-flow__node.selected {
      & > .node {
        border: 2px solid var(--dark-background) !important;
      }
    }
    .instance-actions {
      border-top: 1px solid var(--light-font);
    }
    .react-flow__panel button {
      background-color: var(--light-node);
      color: var(--light-node-font)  !important;;
      border-bottom: 1px solid var(--light-flow-control-boder);

      &:hover {
        background-color: var(--light-flow-control-hover);
      }
      path {
        fill: currentColor;
      }
    }
  }
  
  .dark-react-flow-wrapper {
    border: 1px solid var(--dark-border);
    & > div > .MuiBox-root {
      border-bottom: 1px solid var(--dark-border);
    }
    & > aside > .MuiBox-root {
      border-bottom: 1px solid var(--dark-border);
    }
    .validationflow .react-flow__handle-connecting {
      background-color: var(--dark-error)
    }
    .flow-detail {
      border-left: 1px solid var(--dark-border);
    }
    .validationflow .react-flow__handle-valid {
      background-color: var(--dark-success)
    }
    .node {
      background-color: var(--dark-node);
      color: var(--dark-font);
      border: 1px solid var(--dark-node-border);
    }

    .node-rotate {
      background-color: var(--light-node);
      color: var(--light-font);
      border: 1px solid var(--light-node-border);

      @keyframes rotate-border {
        from {
          transform: rotate(0deg);
        }
        
        to {
          transform: rotate(360deg);
        }
      }
    }
    .node-success,
    .node-succeed,
    .node-warning,
    .node-booting,
    .node-ready {
      background-color: var(--dark-completed-node);
      color: var(--dark-font);
      border: 1px solid var(--dark-node-border);
    }
    .node-cancel,
    .node-cancel,
    .node-failed {
      background-color: var(--dark-error);
      color: var(--dark-font);
      border: 1px solid var(--dark-node-border);
    }
    .react-flow__node.selected {
      & > .node {
        border: 2px solid var(--light-background) !important;
      }
    }
    .instance-actions {
      border-top: 1px solid var(--dark-font);
    }
    .react-flow__panel button {
      background-color: var(--dark-node);
      color: var(--dark-node-font) !important;
      border-bottom: 1px solid var(--dark-flow-control-boder);

      &:hover {
        background-color: var(--dark-flow-control-hover);
      }
      path {
        fill: currentColor;
      }
    }
  }

  .instance-row {
    display: flex;
    padding-bottom: 0.5rem;
    justify-content: space-between;
    .dndnode {
      display: flex;
      align-items: center;
      margin: 0;
    }
    & .view-detail-icon {
      margin-right: 0.5rem;
      pointer-events: auto;
      position: inherit;
      cursor: pointer;
    }
  }

  // input 에서 autocomplete 시에 배경색을 제거
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-transition-delay: 5000s;
    transition-delay: 5000s;
}

  .MuiDialogTitle-root {
    font-size: ${({ theme }) => theme.fontSize.lg};
    font-weight: 700;
  }

  .light-main-container {
    .font {
      color: var(--light-font)
    }
    background-color: var(--light-background);
    .MuiOutlinedInput-root.Mui-disabled {
    background-color: var(--light-disalbed); /* 원하는 배경색으로 변경 */
    .MuiOutlinedInput-notchedOutline {
      border-color: var(--light-disalbed-border); /* 원하는 border 색상으로 변경 */
    }
  }
  .specific_date_button {
      border: 1px solid var(--light-border) !important;
      white-space: nowrap;
      color: var(--light-font) !important;
      height: 95%;
      width: 99%;
      justify-content: space-between !important;
    }
    .Mui-selected {
        color: var(--light-primary);
        & svg {
          color: var(--light-primary);
        }
    }
  }

  .dark-main-container {
    .font {
      color: var(--dark-font)
    }
    background-color: var(--dark-background);
    .MuiOutlinedInput-root.Mui-disabled {
      background-color: var(--dark-disabled);
    .MuiOutlinedInput-notchedOutline {
      border-color: var(--dark-disabled-border); 
      }
    }
    .specific_date_button {
    border: 1px solid var(--dark-border) !important;
    white-space: nowrap;
    color: var(--dark-font) !important;
    height: 95%;
    width: 99%;
    justify-content: space-between !important;
    }
  
    .Mui-selected {
        color: var(--dark-primary);
        & svg {
          color: var(--dark-primary);
        }
    }
    }

  .tooltip-text {
    font-size: ${({ theme }) => theme.fontSize.md};
    padding: 0.15em;
  }
  
  .centered-select {
    text-align: center;
    
    & select {
      text-align: center;
    }
  }
  
  .MuiDrawer-paper li {
    border-radius: 7px;
  }

  .no-p-helper-text {
    & .MuiFormHelperText-root {
        padding-bottom: 0px !important;
    }
  }


  .MuiFormLabel-asterisk {
    color: var(--error);
  }

  .MuiOutlinedInput-root.Mui-focused {
    fieldset {
        border-width: 1px !important;
    }
  } 

  // React-Select LightMode
  .light-react-select {
    padding-bottom: 10px;
    & .light-react-select__control {
      border-color: var(--light-border);
      background-color: var(--light-main);
    }
    }
    .light-react-select__control--is-disabled {
      background-color: var(--light-disalbed) !important; 
      border-color: var(--light-disalbed-border) !important; 
    }
    .light-react-select__single-value--is-disabled {
      color: var(--light-disalbed-color);
    }
  
  // React-Select DarkMode
  .dark-react-select {
    padding-bottom: 10px;
    & .dark-react-select__control {
      border-color: var(--dark-border);
      /* background-color: var(--dark-main); */
      background-color: transparent;
    }
    & .dark-react-select__single-value {
      color: var(--light-background);
    }
    }
    .dark-react-select__control--is-disabled {
      background-color: var(--dark-disabled) !important; 
      border-color: var(--dark-disabled-border) !important; 
      & .dark-react-select__single-value {
        color: var(--dark-disabled-color);
      } 
      & .dark-react-select__indicator  {
        color: var(--dark-disabled-color);
      }
    }

  .light-react-select__menu {
    /* width: fit-content; */
  }  
  .light-react-select__menu-list {
    /* width: fit-content; */
  }
  .dark-react-select__control {
    border-color: var(--dark-border);
    background-color: var(--dark-main);
  }
  .dark-react-select__single-value {
      color: var(--light-background);
  }
  .dark-react-select__menu {
    /* width: fit-content; */
    box-shadow: 0 0 0 1px hsla(255, 255%, 255%, 0.12), 0 4px 11px hsla(255, 255%, 255%, 0);
    border-color: var(--dark-border) !important;
  }
  .dark-react-select__menu-list {
    /* width: fit-content; */
    background-color: var(--dark-select-bg);
  }
  .dark-react-select__option {
    background-color: transparent;
    color: var(--light-background);
  }
  .dark-react-select__option--is-disabled {
    color: #4B4B4B !important;
  }
  .dark-react-select__option--is-selected {
    background-color: var(--dark-primary) !important;
  }
  .dark-react-select__option--is-focused {
    background-color: var(--dark-disabled);
  }

  .light-react-select__multi-value {
    border: 1px solid #e4e6ef;
    background-color: transparent;
    border-radius: 30px;
    padding-top: 3px;
    padding-bottom: 3px;
    padding-right: 5px;
    padding-left: 5px;
  }
  .dark-react-select__multi-value {
    border: 1px solid var(--dark-node);
    background-color: transparent;
    border-radius: 30px;
    padding-top: 3px;
    padding-bottom: 3px;
    padding-right: 5px;
    padding-left: 5px;
  }
  .light-react-select__multi-value__label {
    padding: 0;
  }
  .light-react-select__multi-value__remove {
    padding: 0;
    border-radius: 30px;
    margin-left: 5px;
    &:hover {
      background-color: transparent;
    }
    & .MuiButtonBase-root {
      padding: 0;
    }
  }
  .dark-react-select__multi-value__label {
    padding: 0;
    color: var(--dark-font)
  }
  .dark-react-select__multi-value__remove {
    padding: 0;
    border-radius: 30px;
    margin-left: 5px;
    &:hover {
      background-color: transparent;
    }
    & .MuiButtonBase-root {
      padding: 0;
    }
  }
    
  .light-react-select__menu-portal {
    z-index: 3333;
  }
  .dark-react-select__menu-portal {
    z-index: 3333;
  }

  .MuiFormHelperText-root {
    margin: 0;
  }

  .react-flow__attribution {
    opacity: 0.3;
    pointer-events: none;
  }

  // TreeView Style
  .MuiTreeView-root {
    height: 100%;
  }
  .light-tree-view {
    height: 100%;
    .MuiTreeItem-content.Mui-selected {
      color: var(--light-primary);
      background-color: var(--light-background);
    }
    .MuiTreeItem-content {
      padding: 3px 0px;
      border-radius: 3%;
    }
  }
  .dark-tree-view {
    height: 100%;
    .MuiTreeItem-content.Mui-selected {
      color: var(--dark-primary);
      background-color: var(--dark-background);
    }
    .MuiTreeItem-content {
      padding: 3px 0px;
      border-radius: 3%;
    }
  }

  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ellipsis:focus,
  .ellipsis:hover {
      overflow: visible;
      white-space: normal;
      word-wrap: break-word;
      display: block;
  }

  .table-list {
    display: flex;
    flex-direction: column;
    height: 100%;
    
    & > .MuiCardContent-root {
      display: flex;
      flex-direction: column;
      height: 100%;

      & > .MuiBox-root {
        height: 100%;
        padding-bottom: 0;
      }

    }
  }

  /**
  * react flow style
  */
  .react-flow__handle-right {
    width: 10px !important;
    height: 10px !important;
    right: -12px !important;
  }
  .react-flow__handle-top {
    width: 10px !important;
    height: 10px !important;
    top: -12px !important;
  }
  .react-flow__handle-bottom {
    width: 10px !important;
    height: 10px !important;
    bottom: -12px !important;
  }
  .react-flow__handle-left {
    width: 10px !important;
    height: 10px !important;
    left: -12px !important;
  }

  .react-flow__edge {
    .react-flow__edge-path {
        cursor: grab;
        stroke-width: 3;

        &:active {
            stroke: #ddd;
        }
        &:hover {
            stroke: #ddd;
        }
    }
  }

  .date-picker-wrapper {
    padding-left: 0;
    & > .MuiTextField-root {
        width: 100%;
    }
  }
  .tree-content ~ div {
    max-height: 230px;
    overflow-y: auto;
  }

  svg {
    pointer-events: none;
  }

  .list-select {
    margin-right: 8px;
  }

  thead {
    position: static;
  }
  
  .text-primary {
    color: var(--light-primary)
  }

  .error-text {
    color: var(--error)
  }


  .light-success {
    color: var(--light-success);
  }
  .dark-success {
    color: var(--dark-success);
  }
  .light-primary {
    color: var(--light-primary);
  }
  .dark-primary {
    color: var(--dark-primary);
  }
  .light-warning {
    color: var(--light-warning) !important;
  }
  .dark-warning {
    color: var(--dark-warning) !important;
  }
  .light-error {
    color: var(--light-error);
  }
  .dark-error {
    color: var(--dark-error);
  }

  .light-success-bg {
    background-color: var(--light-success);
  }
  .dark-success-bg {
    background-color: var(--dark-success);
  }
  .light-primary-bg {
    background-color: var(--light-primary);
  }
  .dark-primary-bg {
    background-color: var(--dark-primary);
  }
  .light-warning-bg {
    background-color: var(--light-warning);
  }
  .dark-warning-bg {
    background-color: var(--dark-warning);
  }
  .light-error-bg {
    background-color: var(--light-error);
  }
  .dark-error-bg {
    background-color: var(--dark-error);
  }

  .light-job-status-wrapper {
    gap: 3px;
    position: absolute;
    bottom: 10px;
    left: 1%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    flex-wrap: nowrap;
    padding: 10px;
    border: 1px solid var(--light-border);
    z-index: 5;
    border-radius: 5px;
    background-color: var(--light-main)
  }
  .dark-job-status-wrapper {
    gap: 3px;
    position: absolute;
    bottom: 10px;
    left: 1%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    flex-wrap: nowrap;
    padding: 10px;
    border: 1px solid var(--dark-node);
    z-index: 5;
    border-radius: 5px;
    background-color: var(--dark-background)
  }

  .light-job-preparing {
    background-color: var(--light-node);
    border: 1px solid var(--light-border);
  }
  .light-job-completed {
    background-color: #d3ebc3;
    border: 1px solid var(--light-border);
  }
  .light-job-fail {
     background-color: var(--light-error);
     border: 1px solid var(--light-border);
  }
  .dark-job-preparing {
    background-color: var(--dark-node); 
    border: 1px solid var(--dark-node);
  }
  .dark-job-completed {
    background-color: #d3ebc3;
    border: 1px solid var(--dark-node);
  }
  .dark-job-fail {
    background-color: var(--light-error);
    border: 1px solid var(--dark-node);
  }

  .muted-text {
    color: var(--font-muted)
  }
  

  .light-inactive-cluster {
    &::before {
        margin-left: 3px;
        margin-right: 5px;
        color: transparent;
        text-shadow: 0 0 var(--light-error);
        content: '⚪';
        font-size: 0.7em;
    }
  }
  .dark-inactive-cluster {
    &::before {
        margin-left: 3px;
        margin-right: 5px;
        color: transparent;
        text-shadow: 0 0 var(--dark-error);
        content: '⚪';
        font-size: 0.7em;
    }
  }

  .light-active-cluster {
    &::before {
        margin-left: 3px;
        margin-right: 5px;
        color: transparent;
        text-shadow: 0 0 var(--light-success);
        content: '⚪';
        font-size: 0.7rem;
    }
  }
  .dark-active-cluster {
    &::before {
        margin-left: 3px;
        margin-right: 5px;
        color: transparent;
        text-shadow: 0 0 var(--dark-success);
        content: '⚪';
        font-size: 0.7em;
    }
  }
  .light-warning-cluster {
    &::before {
        margin-left: 3px;
        margin-right: 5px;
        color: transparent;
        text-shadow: 0 0 var(--light-success);
        content: '⚪';
        font-size: 0.7em;
    }
  }
  .dark-warning-cluster {
    &::before {
        margin-left: 3px;
        margin-right: 5px;
        color: transparent;
        text-shadow: 0 0 var(--dark-success);
        content: '⚪';
        font-size: 0.7em;
    }
  }
  .MuiTooltip-popperInteractive {
    pointer-events: none;
    cursor: default;
  }

  .checkd-table-list {
    background-color: rgba(0, 0, 0, 0.04);
  }

  .MuiAlert-standardWarning {
    & .MuiAlert-icon {
      color: var(--light-warning)
    }
  }
  .light-divider {
    border: 1px solid var(--light-border) !important;
  }
  .dark-divider {
    border: 1px solid var(--dark-border) !important;
  }
`;

export default GlobalStyle;
