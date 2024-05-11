import React from 'react';
import { Meta, StoryFn } from '@storybook/react';

import { TodoApp } from '../TodoApp';

export default {
  title: 'TodoApp',
  component: TodoApp,
  argTypes: {},
} as Meta<typeof TodoApp>;

const Template: StoryFn<typeof TodoApp> = (args) => <TodoApp {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  appState: { todos: [], newTodoText: '' },
};
