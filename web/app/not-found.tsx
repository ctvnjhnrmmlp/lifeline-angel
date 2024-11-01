'use client';

function NotFound() {
	return (
		<main className='flex min-h-screen flex-col items-center justify-center items-center'>
			<section className='flex flex-col space-y-8 sm:space-y-10 md:space-y-12 lg:space-y-14 justify-center items-center'>
				{/* <div className='flex flex-col justify-center items-center space-y-8 p-8'>
					<div className='flex flex-col justify-center items-center'>
						<h1 className='font-bold text-6xl md:text-8xl uppercase'>
							Not Found
						</h1>
					</div>
					<div>
						<Link href='/'>
							<button className='py-3 px-5 rounded-xl text-md sm:text-xl md:text-3xl font-bold outline-none text-left text-background bg-foreground tracking-tight'>
								Back Home
							</button>
						</Link>
					</div>
				</div> */}
			</section>
		</main>
	);
}

export default NotFound;
