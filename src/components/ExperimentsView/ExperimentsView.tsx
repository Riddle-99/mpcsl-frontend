import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  getExperimentsForDataset,
  subscribeToExperimentChanges
} from '../../restAPI/apiRequests';
import { IExperiment } from '../../types/types';
import { Spin } from 'antd';
import styles from './ExperimentsView.module.scss';
import { NewExperimentModalForm } from './NewExperimentModal/NewExperimentModal';
import { ExperimentsListItem } from './ExperimentsListItem/ExperimentsListItem';
import ExperimentPlaceholder from './ExperimentPlaceholder/ExperimentPlaceholder';

export const ExperimentsView = ({
  match
}: RouteComponentProps<{ datasetId: string }>) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editDisabled, setEditDisabled] = useState(false);
  const [lastExperiment, setLastExperiment] = useState<
    undefined | IExperiment
  >();
  const datasetId = parseInt(match.params.datasetId, 10);
  const [experiments, setExperiments] = useState<undefined | IExperiment[]>();
  useEffect(() => {
    if (datasetId) {
      const fetchExperiments = () => {
        getExperimentsForDataset(datasetId)
          .then(setExperiments)
          .catch();
      };
      fetchExperiments();
      const sub = subscribeToExperimentChanges(fetchExperiments);
      return () => sub.unsubscribe();
    }
  }, [datasetId]);
  if (!datasetId) {
    return <h1>404</h1>;
  }
  if (!experiments) {
    return (
      <Spin
        style={{
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '50%',
          marginTop: '10%'
        }}
        size="large"
      />
    );
  }
  return (
    <div className={styles.List}>
      <ExperimentPlaceholder
        onClick={() => {
          setModalVisible(true);
        }}
      />
      {experiments.map(experiment => (
        <ExperimentsListItem
          key={experiment.id}
          experiment={experiment}
          onView={id => {
            setEditDisabled(true);
            setLastExperiment(experiments.find(exp => exp.id === id));
            setModalVisible(true);
          }}
          onDuplicate={id => {
            setLastExperiment(experiments.find(exp => exp.id === id));
            setEditDisabled(false);
            setModalVisible(true);
          }}
        />
      ))}
      <NewExperimentModalForm
        visible={modalVisible}
        datasetId={datasetId}
        onClose={() => {
          setModalVisible(false);
          setLastExperiment(undefined);
        }}
        experiment={lastExperiment}
        editDisabled={editDisabled}
      />
    </div>
  );
};
