import { Button, Dropdown, Menu, Modal } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { deleteExperiment } from '../../../restAPI/apiRequests';
import { IExperiment } from '../../../types/types';
import styles from './ExperimentsListItem.module.scss';

const { confirm } = Modal;

export const ExperimentDropdown = (props: {
  experiment: IExperiment;
  onView: () => void;
  onDuplicate: () => void;
}) => {
  const history = useHistory();
  const { experiment } = props;
  return (
    <Dropdown
      overlay={
        <Menu>
          {experiment.last_job && experiment.last_job?.result ? (
            <Menu.Item>
              <Button
                className={styles.DropdownButton}
                onClick={e => {
                  e.stopPropagation();
                  if (experiment.last_job && experiment.last_job?.result) {
                    history.push(
                      `/${experiment.dataset_id}/experiments/${experiment.id}/jobs/${experiment.last_job?.result?.id}`
                    );
                  }
                }}
                type="primary"
                ghost={true}
              >
                View Last Result
              </Button>
            </Menu.Item>
          ) : null}
          <Menu.Item>
            <Button
              className={styles.DropdownButton}
              onClick={e => {
                e.stopPropagation();
                props.onView();
              }}
              key="1"
            >
              View Settings
            </Button>
          </Menu.Item>
          <Menu.Item>
            <Button
              className={styles.DropdownButton}
              onClick={e => {
                e.stopPropagation();
                props.onDuplicate();
              }}
              key="3"
            >
              Duplicate
            </Button>
          </Menu.Item>
          <Menu.Item>
            <Button
              className={styles.DropdownButton}
              onClick={e => {
                e.stopPropagation();
                confirm({
                  title: 'Do you want to delete the following Experiment?',
                  content: `${props.experiment.name} - ${props.experiment.description}`,
                  onOk() {
                    deleteExperiment(props.experiment).catch();
                  }
                });
              }}
              danger={true}
              ghost={true}
              key="4"
            >
              Delete
            </Button>
          </Menu.Item>
        </Menu>
      }
      placement="bottomLeft"
    >
      <EllipsisOutlined type="ellipsis" onClick={e => e.stopPropagation()} />
    </Dropdown>
  );
};
