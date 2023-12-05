import { css } from 'styled-components';

export const buttonProgress = css`
    .reactive-btn-wrapper,
    .reactive-btn {
        cursor: pointer;
        --reactive-button-font-weight: 400;
        --reactive-button-border-radius: 0px;
        --progress-primary-opacity: rgba(54, 153, 255, 0.6);
        --progress-rollback-opacity: rgb(12, 156, 18, 0.6);
    }

    .reactive-btn-wrapper {
        white-space: nowrap;
        width: 100%;
        display: inline-block;
        min-width: var(--reactive-button-min-width);
        height: var(--reactive-button-min-height);
    }

    .reactive-btn-wrapper.block {
        width: 100%;
    }

    .light-main-container {
        .reactive-btn {
            margin-bottom: 0;
            padding: 6px 14px 6px;
            width: 100%;
            min-height: 100%;
            color: var(--dark-font);
            text-align: center;
            line-height: 1.5;
            text-decoration: none;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            vertical-align: middle;
            border: none;
            -webkit-border-radius: 3px;
            -moz-border-radius: 3px;
            border-radius: 3px;
            -webkit-transition: 0.1s;
            -moz-transition: 0.1s;
            transition: 0.1s;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            position: relative;
            overflow: hidden;
            outline: none !important;
            align-items: center;
            -webkit-box-pack: center;
            -webkit-box-align: center;
        }
        .reactive-btn:is([data-button-operation='run']) {
            background-color: var(--progress-primary-opacity) !important;
        }
        .reactive-btn:not([data-button-operation='run']) {
            background-color: var(--progress-rollback-opacity) !important;
        }
        .reactive-btn:is([data-button-operation='run']) .progress {
            background-color: var(--light-primary) !important;
        }
        .reactive-btn:not([data-button-operation='run']) .progress {
            background-color: var(--light-success) !important;
        }
        .reactive-btn:is([data-button-state='failed']) {
            background-color: var(--light-error) !important;
        }
        .reactive-btn:is([data-button-state='failed']) .progress {
            background-color: var(--light-error) !important;
            transform: translateX(0%);
        }
    }
    .dark-main-container {
        .reactive-btn {
            margin-bottom: 0;
            padding: 6px 14px 6px;
            width: 100%;
            min-height: 100%;
            color: var(--light-font);
            text-align: center;
            line-height: 1.5;
            text-decoration: none;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            vertical-align: middle;
            border: none;
            -webkit-border-radius: 3px;
            -moz-border-radius: 3px;
            border-radius: 3px;
            -webkit-transition: 0.1s;
            -moz-transition: 0.1s;
            transition: 0.1s;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            position: relative;
            overflow: hidden;
            outline: none !important;
            align-items: center;
            -webkit-box-pack: center;
            -webkit-box-align: center;
        }
        .reactive-btn:is([data-button-operation='run']) {
            background-color: var(--progress-primary-opacity) !important;
        }
        .reactive-btn:not([data-button-operation='run']) {
            background-color: var(--progress-rollback-opacity) !important;
        }
        .reactive-btn:is([data-button-operation='run']) .progress {
            background-color: var(--dark-primary) !important;
        }
        .reactive-btn:not([data-button-operation='run']) .progress {
            background-color: var(--dark-success) !important;
        }
        .reactive-btn:is([data-button-state='failed']) {
            background-color: var(--dark-error) !important;
        }
        .reactive-btn:is([data-button-state='failed']) .progress {
            background-color: var(--dark-error) !important;
            transform: translateX(0%);
        }
    }

    .reactive-btn:disabled {
        cursor: pointer;
    }

    .reactive-btn.disabled {
        opacity: 0.7;
    }

    .reactive-btn .content {
        position: relative;
        display: flex;
        align-items: center;
        padding: 0;
    }

    .reactive-btn .progress {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        height: 100%;
        width: 100%;
        transform: translateX(100%);
    }

    .reactive-btn:is([data-button-state='rollback_running_10']) .progress {
        transform: translateX(-90%);
        transition: transform 2s cubic-bezier(0.59, 0.01, 0.41, 0.99);
    }
    .reactive-btn:is([data-button-state='rollback_running_20']) .progress {
        transform: translateX(-80%);
        transition: transform 2s cubic-bezier(0.59, 0.01, 0.41, 0.99);
    }
    .reactive-btn:is([data-button-state='rollback_running_30']) .progress {
        transform: translateX(-70%);
        transition: transform 2s cubic-bezier(0.59, 0.01, 0.41, 0.99);
    }
    .reactive-btn:is([data-button-state='rollback_running_40']) .progress {
        transform: translateX(-60%);
        transition: transform 2s cubic-bezier(0.59, 0.01, 0.41, 0.99);
    }
    .reactive-btn:is([data-button-state='rollback_running_50']) .progress {
        transform: translateX(-50%);
        transition: transform 2s cubic-bezier(0.59, 0.01, 0.41, 0.99);
    }
    .reactive-btn:is([data-button-state='rollback_running_60']) .progress {
        transform: translateX(-40%);
        transition: transform 2s cubic-bezier(0.59, 0.01, 0.41, 0.99);
    }
    .reactive-btn:is([data-button-state='rollback_running_70']) .progress {
        transform: translateX(-30%);
        transition: transform 2s cubic-bezier(0.59, 0.01, 0.41, 0.99);
    }
    .reactive-btn:is([data-button-state='rollback_running_80']) .progress {
        transform: translateX(-20%);
        transition: transform 2s cubic-bezier(0.59, 0.01, 0.41, 0.99);
    }
    .reactive-btn:is([data-button-state='rollback_running_90']) .progress {
        transform: translateX(-10%);
        transition: transform 2s cubic-bezier(0.59, 0.01, 0.41, 0.99);
    }
    .reactive-btn:is([data-button-state='rollback_success']) .progress {
        transition: transform 2s cubic-bezier(0.59, 0.01, 0.41, 0.99);
        transform: translateX(0%);
    }

    .reactive-btn:is([data-button-state='job_running_10']) .progress {
        transform: translateX(-90%);
        transition: transform 2s cubic-bezier(0.59, 0.01, 0.41, 0.99);
    }
    .reactive-btn:is([data-button-state='job_running_20']) .progress {
        transform: translateX(-80%);
        transition: transform 2s cubic-bezier(0.59, 0.01, 0.41, 0.99);
    }
    .reactive-btn:is([data-button-state='job_running_30']) .progress {
        transform: translateX(-70%);
        transition: transform 2s cubic-bezier(0.59, 0.01, 0.41, 0.99);
    }
    .reactive-btn:is([data-button-state='job_running_40']) .progress {
        transform: translateX(-60%);
        transition: transform 2s cubic-bezier(0.59, 0.01, 0.41, 0.99);
    }
    .reactive-btn:is([data-button-state='job_running_50']) .progress {
        transform: translateX(-50%);
        transition: transform 2s cubic-bezier(0.59, 0.01, 0.41, 0.99);
    }
    .reactive-btn:is([data-button-state='job_running_60']) .progress {
        transform: translateX(-40%);
        transition: transform 2s cubic-bezier(0.59, 0.01, 0.41, 0.99);
    }
    .reactive-btn:is([data-button-state='job_running_70']) .progress {
        transform: translateX(-30%);
        transition: transform 2s cubic-bezier(0.59, 0.01, 0.41, 0.99);
    }
    .reactive-btn:is([data-button-state='job_running_80']) .progress {
        transform: translateX(-20%);
        transition: transform 2s cubic-bezier(0.59, 0.01, 0.41, 0.99);
    }
    .reactive-btn:is([data-button-state='job_running_90']) .progress {
        transform: translateX(-10%);
        transition: transform 2s cubic-bezier(0.59, 0.01, 0.41, 0.99);
    }
    .reactive-btn:is([data-button-state='job_success']) .progress {
        transition: transform 2s cubic-bezier(0.59, 0.01, 0.41, 0.99);
        transform: translateX(0%);
    }

    .reactive-btn:is([data-button-state='rollback_init']) .progress {
        transform: translateX(-100%);
    }
    .reactive-btn:is([data-button-state='job_init']) .progress {
        transform: translateX(-100%);
    }
`;
