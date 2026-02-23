import { cssInterop } from 'nativewind';
import { Text, TextProps } from './Themed';

function MonoTextComponent(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'SpaceMono' }]} />;
}

cssInterop(MonoTextComponent, { className: 'style' });

export function MonoText(props: TextProps) {
  return <MonoTextComponent {...props} />;
}
