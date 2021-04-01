def _input()
	f = File.open('2020-06-input')
	f.read.split("\n\n").map { |l| l.split "\n"}
end

n = 0
_input().each { |g|
	# n += g.join('').split('').uniq.size

	gg = g.pop.split('')
	g.each { |l| gg &= l.split('') }
	n += gg.size
}

pp n
