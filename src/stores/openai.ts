import {makeAutoObservable, runInAction} from 'mobx';
import {hydrateStore} from 'mobx-persist-store';

import {Assets} from 'react-native-ui-lib';
//Amplify Calls
import {listFoods} from '@app/graphql/customqueries';
import GraphQLAPI, {GRAPHQL_AUTH_MODE} from '@aws-amplify/api-graphql';

export class OpenAIStore implements IStore {
  description = '';

  constructor() {
    makeAutoObservable(this);
  }

  postData = async (url = '', data: any) => {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer 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',
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    console.log(response);
    return await response.json(); // parses JSON response into native JavaScript objects
  };

  describeImageWithOpenAI = async () => {
    const params = {
      model: 'gpt-4-vision-preview',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Can you summarize this marking scheme, so you can be ready to mark papers in our next conversation?',
            },
            {
              type: 'image_url',
              image_url: {
                //url: `data:image/jpeg;base64,${base64Image}`,
                url: require('../exampledata/1703716133983-d97e7ab9-db40-43a4-b313-0f333437414a_1.jpg'),
              },
            },
          ],
        },
      ],
    };

    try {
      // const chatCompletions: any = await openai.chat.completions.create(
      //   params as any,
      // );
      const url = 'https://api.openai.com/v1/chat/completions';
      this.description = 'Sending request to OpenAI...';
      const result = await this.postData(url, params);
      console.log(result);
      return result.choices[0].message.content;
    } catch (error) {
      this.description = JSON.stringify(error);
      console.error(error);
      return null;
    } finally {
      console.log(this.description);
    }
  };

  // Unified set methods
  set<T extends StoreKeysOf<FoodsStore>>(what: T, value: FoodsStore[T]) {
    (this as FoodsStore)[what] = value;
  }
  setMany<T extends StoreKeysOf<FoodsStore>>(obj: Record<T, FoodsStore[T]>) {
    for (const [k, v] of Object.entries(obj)) {
      this.set(k as T, v as FoodsStore[T]);
    }
  }

  // Hydration
  hydrate = async (): PVoid => {
    await hydrateStore(this);
  };
}
