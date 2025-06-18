"use client";

import React, { ReactNode } from "react";

interface FloatingActionButtonsProps {
	children?: ReactNode;
}

export const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = (props) => {
	return (
		<div className="left-0 fixed w-full bottom-0 overflow-hidden  z-10">
			<div className="flex size-full items-center justify-center">
				<div className="px-4 xl:px-8 pb-5 pt-8 bottom-0 w-full max-w-7xl flex justify-center gap-2">
					{props.children}
				</div>
			</div>
		</div>
	);
};