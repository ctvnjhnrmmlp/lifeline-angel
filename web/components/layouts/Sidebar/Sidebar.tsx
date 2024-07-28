'use client';

import Link from 'next/link';

const Sidebar = () => {
	return (
		<aside className='fixed flex flex-col justify-center p-4 z-10 h-screen'>
			<div className='hidden lg:block overflow-y-scroll no-scrollbar backdrop-blur-2xl bg-foreground/5 rounded-2xl h-screen w-[8.3rem]'>
				<div className='w-full flex flex-col flex-wrap justify-between space-between px-4 py-6 gap-12'>
					<div className='flex flex-col gap-4'>
						{/*  */}
						<div className='rounded-xl'>
							<Link href={'/'}>
								<div className='items-center rounded-xl cursor-pointer'>
									<p className='font-bold w-full text-xl text-foreground tracking-tight text-center'>
										Mamba
									</p>
								</div>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</aside>
	);
};

export default Sidebar;
