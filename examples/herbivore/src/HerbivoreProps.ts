import {Direction, EntityProps} from 'pixcellular';

export type HerbivoreProps = EntityProps & {
  energy: number
  dir: Direction,
};

export function isHerbivoreProps(props): props is HerbivoreProps {
  if (props && props.energy && props.dir && props.sex) {
    return props;
  }
}
