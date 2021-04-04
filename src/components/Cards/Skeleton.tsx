import React from 'react';

import styled, { css, keyframes } from 'styled-components';

import _Skeleton, { SkeletonProps as _SkeletonProps } from '@material-ui/lab/Skeleton';

export interface CustomSkeletonProps {
	animation?: { type: 'pulse' | 'wave' | false; stagger?: number; duration?: number | string };
}

type SkeletonProps = CustomSkeletonProps & Omit<_SkeletonProps, 'animation'>;

const anims = {
	pulse: {
		duration: '1.5s',
		ease: 'ease-in-out',
		keyframes: keyframes`
	0% { opacity: 1; }
	50% { opacity: 0.4; }
	100% { opacity: 1; }
	`,
	},
	wave: {
		duration: '1.6s',
		ease: 'linear',
		keyframes: keyframes`
	0% { transform: translateX(-100%) },
	60% { transform: translateX(100%) },
	100% { transform: translateX(100%) }
	`,
	},
};

const styles = {
	shadow:
		'0px 1px 3px 0px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 2px 1px -1px rgb(0 0 0 / 12%);',
};

const StyledSkeleton = styled(_Skeleton)<{
	$animation: SkeletonProps['animation'];
}>`
	box-shadow: ${styles.shadow};
	border-radius: 4px;
	background-color: white;
	${({ $animation: a }) =>
		a &&
		a.type &&
		css`
			&.MuiSkeleton-${a.type} {
				animation: ${anims[a.type].keyframes} ${a.duration ?? anims[a.type].duration}
					${anims[a.type].ease} ${0.5 + (a.stagger ?? 0)}s infinite;
			}
		`}
`;

const Skeleton: React.FC<SkeletonProps> = props => {
	const { animation, ...baseProps } = props;
	return <StyledSkeleton {...baseProps} $animation={animation} />;
};

export default Skeleton;
