def _input()
	# f = [%w(9 2 6 3 1).join("\n"), %w(5 8 4 7 10).join("\n")]
	f = File.open('2020-22-input').read.split("\n\n")

	f.map { |p|
		p.split("\n").map(&:to_i)
	}
end

p1, p2 = _input

def deal(p1, p2)
	c1 = p1.shift
	c2 = p2.shift

	#2
	if p1.size >= c1 && p2.size >= c2
		if game(p1[0..c1-1], p2[0..c2-1])[0] == 1
			p1.push c1, c2
		else
			p2.push c2, c1
		end
		return
	end

	if c1 > c2
		p1.push c1, c2
	else
		p2.push c2, c1
	end
end

def score(pl)
	_p = pl.reverse
	score = 0
	(0.._p.size-1).each { |i| score += _p[i]*(i+1) }
	score
end

def _hash(p1, p2, h)
	_h = p1.join('.') + '|' + p2.join('.')
	return true unless h[_h].nil?
	h[_h] = 1
	false
end

def game(p1, p2)
	h = {}
	p "game: #{p1} vs #{p2}"
	while true do
		deal(p1, p2)
		# p "move: #{p1} | #{p2}"
		return 2, score(p2) if p1.size == 0
		return 1, score(p1) if p2.size == 0
		return 1, score(p1) if _hash(p1, p2, h)
	end
end

p "Result: #{game p1, p2}"
