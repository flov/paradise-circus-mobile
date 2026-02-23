import React from 'react';

import { ExternalLink } from './ExternalLink';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';

export default function EditScreenInfo({ path }: { path: string }) {
  return (
    <View className="bg-transparent">
      <View className="items-center mx-[50px]">
        <Text className="text-pc-textSecondary text-[17px] leading-6 text-center">
          Open up the code for this screen:
        </Text>

        <View className="rounded-sm px-1 my-1.5 bg-pc-card/5">
          <MonoText className="text-pc-text">{path}</MonoText>
        </View>

        <Text className="text-pc-textSecondary text-[17px] leading-6 text-center">
          Change any of the text, save the file, and your app will automatically update.
        </Text>
      </View>

      <View className="mt-4 mx-5 items-center">
        <ExternalLink
          className="py-4"
          href="https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet"
        >
          <Text className="text-pc-accent text-center">
            Tap here if your app doesn't automatically update after making changes
          </Text>
        </ExternalLink>
      </View>
    </View>
  );
}
