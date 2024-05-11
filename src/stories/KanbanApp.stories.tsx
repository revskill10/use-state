import React from 'react';
import { Meta, StoryFn } from '@storybook/react';

import { KanbanApp as Example } from '../examples/KanbanApp';

export default {
  title: 'KanbanApp',
  component: Example,
  argTypes: {},
} as Meta<typeof Example>;

const Template: StoryFn<typeof Example> = () => <Example />;

export const Primary = Template.bind({});

Primary.args = {};
