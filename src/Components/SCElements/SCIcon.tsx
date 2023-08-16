import { CSSProperties, FC, memo } from "react"
import Icons from "../../assets/icons.svg"

interface SCIconProps {
    name: string;
    fill?: string;
    size?: number;
    height?: number;
    width?: number;
    margin?: string;
    cssClass?: string;
    style?: CSSProperties
  }

const SCIcon: FC<SCIconProps> = ({ name, fill, size, height, width, margin, cssClass, style, ...props }) => (
  <svg
    className={`icon icon-${name}${cssClass ? " " + cssClass : ""}`}
    fill={fill ? fill : "var(--SC-secondary)"}
    height={height ? height : size ? size : 24}
    width={width ? width : size ? size : 24}
    style={{ margin: margin ? margin : "" , ...style }}
    {...props}
  >
    <use xlinkHref={`${Icons}#icon-${name}`} />
  </svg>
)

export default memo(SCIcon)