const CloseIcon = ({ width = 24, height = 24, color = 'currentColor', className = 'icon', ...props }: React.SVGProps<SVGSVGElement>) => (
	<svg
		className={className}
		xmlns="http://www.w3.org/2000/svg"
		width={width}
		height={height}
		viewBox="0 0 24 24"
		fill="none"
		stroke={color}
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<line x1="18" y1="6" x2="6" y2="18" />
		<line x1="6" y1="6" x2="18" y2="18" />
	</svg>
)

export default CloseIcon
