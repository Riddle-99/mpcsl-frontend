import React, { useEffect, useState } from 'react';
import { Form, Input, message, Modal, Select } from 'antd';
import {
  createDatasetGenerationJob,
  getK8SNodes
} from '../../../restAPI/apiRequests';
import ParameterForms from '../../ParameterForm/ParameterForms';

import MPCSLGenerator from '../../../config/datasetGeneration/mpcsl_dag.json';
import PCAlg from '../../../config/datasetGeneration/pcalg.json';
import {
  ICreateDatasetGenerationJob,
  IParameters,
  GeneratorType
} from '../../../types/types';

const { Option } = Select;

export interface IFormGenerationJob {
  datasetName: string;
  kubernetesNode?: string;
  generator_type: string;
}

interface Props {
  visible: boolean;
  editDisabled?: boolean;
  onClose: () => void;
  observationMatrix?: IFormGenerationJob;
}

const DatasetGenerationModal: React.FC<Props> = ({
  visible,
  onClose,
  editDisabled
}) => {
  const [form] = Form.useForm();
  const [k8sNodes, setK8sNodes] = useState<undefined | string[]>();
  const [generatorParameters, setGeneratorParameter] = useState<IParameters>(
    {}
  );

  const handleGeneratorSelection = (type: GeneratorType) => {
    switch (type) {
      case GeneratorType.MPCSL:
        setGeneratorParameter(MPCSLGenerator as IParameters);
        break;
      case GeneratorType.PCALG:
        setGeneratorParameter(PCAlg as IParameters);
        break;
    }
  };

  useEffect(() => {
    getK8SNodes()
      .then(setK8sNodes)
      .catch(() => setK8sNodes([]));
  }, []);

  const handleSubmit = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    const submitObservationMatrix = (values: ICreateDatasetGenerationJob) => {
      createDatasetGenerationJob({
        datasetName: values.datasetName,
        kubernetesNode: values.kubernetesNode,
        parameters: values.parameters,
        generator_type: values.generator_type
      })
        .then(onClose)
        .catch(error => {
          if (error.status !== 400) {
            onClose();
          }
        });
    };

    form
      .validateFields()
      .then(values => {
        const dto: ICreateDatasetGenerationJob = {
          datasetName: values.datasetName,
          kubernetesNode:
            values.kubernetesNode === '_none'
              ? undefined
              : values.kubernetesNode,
          generator_type: values.generator_type,
          parameters: {}
        };
        const objectKeys = Object.keys(dto);

        // Add remaining parameters to key "parameters"
        for (const [key, value] of Object.entries(values)) {
          if (!objectKeys.includes(key)) {
            dto.parameters[key] = value;
          }
        }
        return dto;
      })
      .then(jobDto => submitObservationMatrix(jobDto))
      .catch(() =>
        message.error(
          'Set a Observation Matrix Name and Query and select a Data Source from the list.'
        )
      );
  };

  return (
    <Modal
      title={'Generate dataset'}
      onCancel={onClose}
      onOk={handleSubmit}
      visible={visible}
      okText={'Create Dataset Generation Job'}
    >
      <Form form={form} layout="vertical" className="Modal-Form">
        <Form.Item
          label="Dataset Name"
          name="datasetName"
          rules={[
            { required: true, message: 'Select an unique dataset name' },
            {
              pattern: /^[a-z][0-9a-z]*$/,
              message: 'Only lowercase and numbers, must start with a letter'
            }
          ]}
        >
          <Input placeholder="Dataset name" />
        </Form.Item>

        <Form.Item
          label="Select an enviroment"
          name="kubernetesNode"
          initialValue={'_none'}
          rules={[{ required: true, message: 'Select an enviroment' }]}
        >
          <Select>
            <Option value="_none" style={{ fontStyle: 'italic' }}>
              Default
            </Option>
            {k8sNodes
              ? k8sNodes.map(node => (
                  <Option key={node} value={node}>
                    {node}
                  </Option>
                ))
              : null}
          </Select>
        </Form.Item>

        <Form.Item
          name="generator_type"
          label="Generator selection"
          hasFeedback={true}
          rules={[
            { required: true, message: 'Select a generator' },
            {
              validator: (rule: any, value: any, callback: () => void) => {
                handleGeneratorSelection(value);
                callback();
              }
            }
          ]}
        >
          <Select disabled={editDisabled}>
            {Object.keys(GeneratorType).map(name => (
              <Select.Option value={name} key={name}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <ParameterForms
          parameters={generatorParameters}
          editDisabled={editDisabled}
        />
      </Form>
    </Modal>
  );
};

export default DatasetGenerationModal;
